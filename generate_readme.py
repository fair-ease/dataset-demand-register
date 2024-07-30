import os

def generate_file_list(root_dir='.'):
    file_list = []
    for root, dirs, files in os.walk(root_dir):
        level = root.replace(root_dir, '').count(os.sep)
        indent = ' ' * 4 * level
        file_list.append(f'{indent}- {os.path.basename(root)}/')
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            file_list.append(f'{sub_indent}- {f}')
    return '\n'.join(file_list)

def update_readme(file_list, readme_path='README.md'):
    with open(readme_path, 'w') as readme_file:
        readme_file.write('# Project Directory Structure\n\n')
        readme_file.write(file_list)

if __name__ == '__main__':
    file_list = generate_file_list()
    update_readme(file_list)