import json
import os
import shutil


def build_registry_index():
    children = find_children("./registry")
    return [
        {
            "type": "group",
            "name": "Registry",
            "children": children,
        }
    ]


def find_children(registry, path=""):
    children = []
    with os.scandir(os.path.join(registry, path)) as it:
        for entry in it:
            if entry.is_file():
                children.append({
                    "type": "item",
                    "name": entry.name,
                    "path": path + entry.name,
                })
            elif entry.is_dir():
                children.append({
                    "type": "group",
                    "name": entry.name,
                    "children": find_children(registry, path + entry.name + "/"),
                })
    return children


if __name__ == "__main__":
    index = build_registry_index()
    os.makedirs("./web/_data", exist_ok=True)
    with open("./web/_data/registry.json", "w") as f:
        f.write(json.dumps(index))
    shutil.copytree("./registry", "./web/registry")
