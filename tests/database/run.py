#!/usr/bin/env python3
"""Test the production SQL in a disposable PostgreSQL cluster; no live account needed."""
import concurrent.futures
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time


ROOT = Path(__file__).resolve().parents[2]


def binaries():
    candidates = [os.environ.get("PG_BIN"), "/Applications/Postgres.app/Contents/Versions/latest/bin"]
    if shutil.which("pg_config"):
        candidates.append(subprocess.check_output(["pg_config", "--bindir"], text=True).strip())
    if shutil.which("initdb"):
        candidates.append(str(Path(shutil.which("initdb")).parent))
    for directory in candidates:
        if directory and (Path(directory) / "initdb").exists():
            return Path(directory)
    raise SystemExit("PostgreSQL binaries missing: install PostgreSQL or set PG_BIN to its bin directory.")


def main():
    pg_bin = binaries()
    with tempfile.TemporaryDirectory(prefix="star-garden-db-") as directory:
        temp = Path(directory)
        # A short Unix socket path also works with long macOS temporary-directory names.
        with socket.socket() as address:
            address.bind(("127.0.0.1", 0))
            port = address.getsockname()[1]
        data = temp / "data"
        subprocess.run([str(pg_bin / "initdb"), "-D", str(data), "-A", "trust", "-U", "postgres", "--no-locale", "--encoding=UTF8"], check=True, stdout=subprocess.DEVNULL)
        options = f"-h 127.0.0.1 -p {port} -k /tmp -c fsync=off -c log_min_messages=warning"
        subprocess.run([str(pg_bin / "pg_ctl"), "-D", str(data), "-l", str(temp / "postgres.log"), "-o", options, "-w", "start"], check=True, stdout=subprocess.DEVNULL)
        command = [str(pg_bin / "psql"), "-X", "-qAt", "-v", "ON_ERROR_STOP=1", "-h", "127.0.0.1", "-p", str(port), "-U", "postgres", "postgres"]

        def sql(statement):
            result = subprocess.run(command, input=statement, capture_output=True, text=True)
            if result.returncode:
                raise AssertionError(result.stderr.strip())
            return result.stdout.strip()

        def authenticated(statement, uid="00000000-0000-4000-8000-000000000003"):
            return sql(f"set role authenticated; set request.jwt.claim.sub = '{uid}'; {statement}")

        def literal(value):
            return "'" + json.dumps(value, ensure_ascii=False).replace("'", "''") + "'::jsonb"

        try:
            sql((ROOT / "tests/database/bootstrap.sql").read_text())
            sql((ROOT / "supabase/migrations/202609050001_shared_gardens.sql").read_text())
            sql((ROOT / "tests/database/contract.sql").read_text())
            print("PASS: initialization, legacy balances/notes, CAS, receipts, validation, ownership, private avatar policies")

            doc = {"child": {"name": "Race winner", "avatar": "🦁", "currentStars": 5}, "rewards": [], "activityPresets": [], "events": []}
            first = f"select public.initialize_garden({literal(doc)});"
            other_doc = json.loads(json.dumps(doc))
            other_doc["child"]["name"] = "Competing initializer"
            other = f"select public.initialize_garden({literal(other_doc)});"
            # Hold the first transaction's insert uncommitted while the second competes.
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                initial = pool.submit(authenticated, f"begin; {first} select pg_sleep(0.4); commit;")
                time.sleep(0.1)
                competing = pool.submit(authenticated, other)
                results = [json.loads(value.splitlines()[0]) for value in [initial.result(), competing.result()]]
            assert sorted(result["status"] for result in results) == ["exists", "initialized"]
            assert results[0]["garden"]["document"] == results[1]["garden"]["document"]
            print("PASS: competing initializations create exactly one garden")

            redeemed = json.loads(json.dumps(doc))
            redeemed["child"]["currentStars"] = 0
            redeemed["events"] = [{"id": "redemption", "label": "Reward", "starChange": -5}]
            operation = "20000000-0000-4000-8000-000000000001"
            commit = f"select public.commit_garden(1, '{operation}', {literal(redeemed)});"
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                winner = pool.submit(authenticated, f"begin; {commit} select pg_sleep(0.4); commit;")
                time.sleep(0.1)
                loser = pool.submit(authenticated, commit.replace(operation, "20000000-0000-4000-8000-000000000002"))
                results = [json.loads(value.splitlines()[0]) for value in [winner.result(), loser.result()]]
            assert sorted(result["status"] for result in results) == ["conflict", "saved"]
            assert all(result["garden"]["revision"] == 2 for result in results)
            assert all(result["garden"]["document"]["child"]["currentStars"] == 0 for result in results)
            print("PASS: concurrent redemptions cannot overspend or overwrite")

            retry_doc = json.loads(json.dumps(redeemed))
            retry_doc["child"]["currentStars"] = 2
            retry = f"select public.commit_garden(2, '20000000-0000-4000-8000-000000000003', {literal(retry_doc)});"
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                first_retry = pool.submit(authenticated, f"begin; {retry} select pg_sleep(0.4); commit;")
                time.sleep(0.1)
                second_retry = pool.submit(authenticated, retry)
                results = [json.loads(value.splitlines()[0]) for value in [first_retry.result(), second_retry.result()]]
            assert sorted(result["status"] for result in results) == ["duplicate", "saved"]
            assert all(result["garden"]["revision"] == 3 for result in results)
            assert sql("select count(*) from public.garden_operations where user_id = '00000000-0000-4000-8000-000000000003';") == "2"
            print("PASS: simultaneous retry is accepted exactly once")
        finally:
            subprocess.run([str(pg_bin / "pg_ctl"), "-D", str(data), "-m", "immediate", "-w", "stop"], check=True, stdout=subprocess.DEVNULL)


if __name__ == "__main__":
    main()
