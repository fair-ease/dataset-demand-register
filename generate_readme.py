import os

def generate_file_list(folder_path):
    file_list = []
    for root, dirs, files in os.walk(folder_path):
        level = root.replace(folder_path, '').count(os.sep)
        indent = ' ' * 4 * level
        if root == folder_path:
            file_list.append(f'{indent}- **{os.path.basename(root)}/**')
        else:
            file_list.append(f'{indent}- **{os.path.basename(root)}/**')
        
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            file_path = os.path.join(root, f).replace('\\', '/')
            file_list.append(f'{sub_indent}- [{f}]({file_path})')
    
    return '\n'.join(file_list)

def update_readme(folder_path):
    file_list = generate_file_list(folder_path)
    readme_path = os.path.join(folder_path, 'README.md')
    
    with open(readme_path, 'w') as readme_file:
        readme_file.write('# Directory Structure\n\n')
        readme_file.write(file_list)

if __name__ == '__main__':
    # Define the list of folders to include
    folders_to_include = ['design', 'docs', 'meetings', 'registry', 'spec']
    
    for folder in folders_to_include:
        if os.path.isdir(folder):
            update_readme(folder)
        else:
            print(f"Warning: '{folder}' is not a valid directory.")