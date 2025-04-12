import os

def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            total_lines = 0
            code_lines = 0
            in_block_comment = False

            for line in file:
                total_lines += 1
                stripped = line.strip()
                if not stripped:
                    continue
                if in_block_comment:
                    if "*/" in stripped:
                        in_block_comment = False
                    continue
                if stripped.startswith("//"):
                    continue
                if stripped.startswith("/*"):
                    in_block_comment = not "*/" in stripped
                    continue

                code_lines += 1

        print(f"Processed: {file_path} ({total_lines} lines, {code_lines} code lines)")
        return total_lines, code_lines
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return 0, 0

def scan_directory(directory):
    num_files = 0
    tsx_total = tsx_code = 0
    js_total = js_code = 0

    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.next']]

        for file in files:
            if file in ['extension.js'] or file.endswith(('.mjs', '.yml')):
                continue
            file_path = os.path.join(root, file)

            if file.endswith('.js'):
                num_files += 1
                total, code = process_file(file_path)
                js_total += total
                js_code += code
            elif file.endswith('.tsx'):
                num_files += 1
                total, code = process_file(file_path)
                tsx_total += total
                tsx_code += code

    total_lines = tsx_total + js_total
    total_code_lines = tsx_code + js_code

    print(f"\nfiles processed: {num_files}\n")
    print(f"total LOC: {total_lines} | true LOC: {total_code_lines}\n")
    print(f"frontend | total LOC: {tsx_total} | true LOC: {tsx_code}\n")
    print(f"fackend | total LOC: {js_total} | true LOC: {js_code}\n")

if __name__ == "__main__":
    directory_to_scan = "."
    scan_directory(directory_to_scan)
