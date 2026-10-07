import { FileText, Folder } from "lucide-react";
import clsx from "clsx";

export interface FileTreeItem {
  name: string;
  /** Explicitly mark as file or folder; folders are inferred from children. */
  type?: "file" | "folder";
  /** Muted annotation after the name, e.g. "entry point". */
  note?: string;
  /** Accent-highlight the row (e.g. the file being discussed). */
  highlight?: boolean;
  children?: FileTreeItem[];
}

function TreeItem({ item }: { item: FileTreeItem }) {
  const isFolder = item.type === "folder" || !!item.children?.length;
  const Icon = isFolder ? Folder : FileText;
  return (
    <li className="filetree-item">
      <span className={clsx("filetree-row", item.highlight && "highlight")}>
        <Icon className="filetree-icon" aria-hidden />
        <span className="filetree-name">{item.name}</span>
        {item.note && <span className="filetree-note">{item.note}</span>}
      </span>
      {item.children && (
        <ul className="filetree-children">
          {item.children.map((c) => (
            <TreeItem key={c.name} item={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Directory/file structure diagram.
 *
 * <FileTree items={[
 *   { name: "app", children: [{ name: "layout.tsx" }, { name: "page.tsx" }] },
 * ]} />
 */
export function FileTree({ items }: { items: FileTreeItem[] }) {
  return (
    <div className="filetree">
      <ul className="filetree-root">
        {items.map((item) => (
          <TreeItem key={item.name} item={item} />
        ))}
      </ul>
    </div>
  );
}
