import json
import os
import shutil
from typing import Self
from distutils.dir_util import copy_tree


class IndexItem:
    name: str
    path: str

    def __init__(self, name, path):
        self.name = name
        self.path = path

    def to_dict(self) -> dict:
        return {
            "type": "item",
            "name": self.name,
            "path": self.path,
        }


class IndexGroup:
    name: str
    children: list[IndexItem | Self]

    def __init__(self, name, children):
        self.name = name
        self.children = children

    def to_dict(self) -> dict:
        return {
            "type": "group",
            "name": self.name,
            "children": list(map(lambda c: c.to_dict(), self.children)),
        }


def index_registry() -> IndexGroup:
    children = find_children("./registry")
    return IndexGroup("registry", children)


def find_children(registry, path="") -> list[IndexItem | IndexGroup]:
    children = []
    with os.scandir(os.path.join(registry, path)) as it:
        for entry in it:
            if entry.is_file() and entry.name.endswith(".ttl"):
                name = os.path.splitext(entry.name)[0]
                children.append(IndexItem(name, path + name))
            elif entry.is_dir():
                entry_children = find_children(registry, path + entry.name + "/")
                children.append(IndexGroup(entry.name, entry_children))
    return children


def create_registry_files(base: str, registry: list[IndexItem | IndexGroup]):
    for item in registry:
        if isinstance(item, IndexItem):
            create_registry_item_files(base, item)
        else:
            print(f"group {item.name}")
            os.makedirs(os.path.join(base, item.name))
            create_registry_files(os.path.join(base, item.name), item.children)


def create_registry_item_files(path, item: IndexItem):
    srcpath = os.path.join("registry", item.path) + ".ttl"
    dstpath = os.path.join(path, item.name) + ".ttl"
    dstdir = path # os.path.dirname(dstpath)
    # copy turtle file
    shutil.copyfile(srcpath, dstpath)
    # create web page
    querypath = os.path.relpath(os.path.splitext(dstpath)[0], "./web")
    webname = item.name + ".md"
    with open(os.path.join(dstdir, webname), "w") as f:
        f.write(
            "---\n"
            "layout: page\n"
            "css:\n"
            "    - query.css\n"
            "js:\n"
            "    - rdflib.min.js\n"
            "    - turtle.js\n"
            "    - query.js\n"
            "preload:\n"
            f"    - {item.name}.ttl\n"
            f"permalink: {querypath}.html\n"
            "---\n"
        )
        f.write(f'{{% include query.html query="{item.path}" %}}\n')


def filter_turtle(base, items: list[str]) -> list[str]:

    def isdir(item):
        return os.path.isdir(os.path.join(base, item))

    def isturtle(item):
        filepath = os.path.join(base, item)
        return os.path.isfile(filepath) and item.endswith(".ttl")

    return list(filter(lambda item: not (isdir(item) or isturtle(item)), items))


if __name__ == "__main__":
    # copy docs
    copy_tree('./docs', './web/docs')
    # generate registry index
    index = index_registry()
    os.makedirs("./web/_data", exist_ok=True)
    with open("./web/_data/registry.json", "w") as f:
        f.write(json.dumps([index.to_dict()]))
    # clean up the registry directory in the website, in case it already exists
    try:
        shutil.rmtree("./web/registry")
    except:
        pass
    create_registry_files("./web", [index])
