import os

def generate_file_list(folder_path):
    file_list = []
    folder_depth = {}  # Dictionary to track depth of each folder for removal of repetition

    for root, dirs, files in os.walk(folder_path):
        # Calculate the level (depth) of the current folder
        level = root.replace(folder_path, '').count(os.sep)
        indent = ' ' * 4 * level

        # Only add folder if it's not redundant
        folder_name = os.path.basename(root)
        if root == folder_path:
            file_list.append(f'{indent}- **{folder_name}/**')
        else:
            parent_folder = os.path.basename(os.path.dirname(root))
            file_list.append(f'{indent}- **{folder_name}/**')
            folder_depth[parent_folder] = level
        
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            if str(f).lower() != 'readme.md':
                file_path = os.path.join(root, f).replace('\\', '/')
                # Create a relative path starting from the top-level folder
                relative_path = os.path.relpath(file_path, folder_path).replace('\\', '/')
                file_list.append(f'{sub_indent}- [{f}]({relative_path})')

        if len(files) == 1 and files[0].lower() == 'readme.md':
            file_list.append(f"{sub_indent}- this folder doesn't contain any files")

    return '\n'.join(file_list)

def update_readme(folder_path, descr):
    file_list = generate_file_list(folder_path)
    readme_path = os.path.join(folder_path, 'README.md')
    
    with open(readme_path, 'w') as readme_file:
        readme_file.write(f'# {folder_path}\n\n')
        readme_file.write(f'*{descr}*\n\n')
        readme_file.write(file_list)

if __name__ == '__main__':
    # Define the list of folders to include
    folders_to_include = ['design', 'docs', 'registry', 'spec']
    description_to_include = [
        'Design of core model and preliminary extensions with examples of model implementations.',
        'Markdown files and images providing detailed explanations.',
        'Description of the actual dataset-demand-register and listed registry entries.',
        'Specification files in markdown, SHACL, and other formats.']
    for i, folder in enumerate(folders_to_include):
        if os.path.isdir(folder):
            update_readme(folder, description_to_include[i])
        else:
            print(f"Warning: '{folder}' is not a valid directory.")