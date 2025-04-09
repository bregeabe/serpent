import os

def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            line_count = sum(1 for _ in file)
        print(f"Processed: {file_path} ({line_count} lines)")
        return line_count
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return 0

def scan_directory(directory):
    num_dirs = 0
    tsx_lines = 0
    js_lines = 0
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.next' in dirs:
            dirs.remove('.next')

        for file in files:
            if file == 'extension.js' or file.endswith('.mjs'):
                continue
            if file.endswith('js'):
                num_dirs+=1
                file_path = os.path.join(root, file)
                js_lines += process_file(file_path)
            elif file.endswith('tsx'):
                num_dirs+=1
                file_path = os.path.join(root, file)
                tsx_lines += process_file(file_path)
    total_lines = tsx_lines + js_lines

    print(f"Total lines of code: {total_lines} from {num_dirs} files\n{tsx_lines} lines of frontend code\n{js_lines} lines of backend code")

if __name__ == "__main__":
    directory_to_scan = "."
    scan_directory(directory_to_scan)
