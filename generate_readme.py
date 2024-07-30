import os
import yaml

def load_config(config_path='_config.yml'):
    """Load the URL from the YAML config file."""
    with open(config_path, 'r') as file:
        config = yaml.safe_load(file)
    return config.get('url', '')  # Return URL or empty string if not found

def generate_file_list(folder_path, base_url):
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
            # Replace local path with URL
            url_path = file_path.replace(folder_path, base_url)
            file_list.append(f'{sub_indent}- [{f}]({url_path})')
    
    return '\n'.join(file_list)

def update_readme(folder_path, base_url):
    file_list = generate_file_list(folder_path, base_url)
    readme_path = os.path.join(folder_path, 'README.md')
    
    with open(readme_path, 'w') as readme_file:
        readme_file.write(f'# {folder_path}\n\n')
        readme_file.write(file_list)

if __name__ == '__main__':
    # Define the list of folders to include
    folders_to_include = ['design', 'docs', 'meetings', 'registry', 'spec']
    
    # Load URL from the _config.yml file
    base_url = load_config()

    for folder in folders_to_include:
        if os.path.isdir(folder):
            update_readme(folder, base_url)
        else:
            print(f"Warning: '{folder}' is not a valid directory.")