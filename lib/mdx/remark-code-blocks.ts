import { visit } from "unist-util-visit";
import type { Node, Parent } from "unist";
import { langLabel, parseMeta } from "../code-meta";

interface CodeNode extends Node {
  type: "code";
  lang?: string | null;
  meta?: string | null;
  value: string;
}

interface MdxJsxAttribute {
  type: "mdxJsxAttribute";
  name: string;
  value: string;
}

interface MdxJsxFlowElement extends Node, Parent {
  type: "mdxJsxFlowElement";
  name: string;
  attributes: MdxJsxAttribute[];
}

/** Elements that treat consecutive code fences as tabbed panels. */
const TAB_CONTAINERS = new Set(["CodeTabs"]);

/**
 * Converts fenced code blocks into <CodeBlock> JSX elements so every code
 * fence in MDX gets the same rendered component (Shiki highlighting, title,
 * line numbers, copy button). Meta strings like
 *
 *   ```ts title="client.ts" {2,4-5} lineNumbers
 *
 * are passed through via the `meta` attribute.
 *
 * When a fence is a direct child of a tab container (e.g. <CodeTabs>), its
 * label is also appended to the container's `labels` attribute so the client
 * component can render tab triggers without introspecting RSC children.
 */
export function remarkCodeBlocks() {
  return (tree: Node) => {
    visit(tree, "code", (node: CodeNode, index, parent: Parent | undefined) => {
      if (!parent || typeof index !== "number") return;

      const element: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: "CodeBlock",
        attributes: [
          { type: "mdxJsxAttribute", name: "lang", value: node.lang ?? "text" },
          { type: "mdxJsxAttribute", name: "code", value: node.value },
          { type: "mdxJsxAttribute", name: "meta", value: node.meta ?? "" },
        ],
        children: [],
      } as MdxJsxFlowElement;
      parent.children[index] = element;

      const container = parent as MdxJsxFlowElement;
      if (
        container.type === "mdxJsxFlowElement" &&
        TAB_CONTAINERS.has(container.name)
      ) {
        const parsed = parseMeta(node.meta);
        const label = parsed.title ?? langLabel(node.lang);
        let attr = container.attributes.find((a) => a.name === "labels");
        if (!attr) {
          attr = {
            type: "mdxJsxAttribute",
            name: "labels",
            value: JSON.stringify([]),
          };
          container.attributes.push(attr);
        }
        const labels = JSON.parse(attr.value) as string[];
        labels.push(label);
        attr.value = JSON.stringify(labels);
      }
    });
  };
}
