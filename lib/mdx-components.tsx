import type { ComponentProps, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { Link2 } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { CodeTabs } from "@/components/code-tabs";
import { Callout } from "@/components/callout";
import { Tabs, Tab } from "@/components/tabs";
import { Accordion, AccordionItem } from "@/components/accordion";
import { ApiEndpoint, MethodBadge } from "@/components/api-endpoint";
import { ParamTable } from "@/components/param-table";
import { ResponseExample } from "@/components/response-example";
import { TryIt } from "@/components/try-it";
import { Badge } from "@/components/badge";
import { Card, CardGrid } from "@/components/card";
import { Flow } from "@/components/flow";
import { Steps, Step } from "@/components/steps";
import { FileTree } from "@/components/file-tree";
import { Figure } from "@/components/figure";
import { Kbd } from "@/components/kbd";
import { Columns, Column } from "@/components/columns";
import { Checklist } from "@/components/checklist";
import { Icon } from "@/components/icon";
import { RelatedLinks } from "@/components/related-links";
import { Term } from "@/components/term";

function Heading({
  level,
  children,
  id,
  ...props
}: ComponentProps<"h2"> & { level: 2 | 3 | 4 }) {
  const Tag = `h${level}` as "h2";
  return (
    <Tag id={id} className="heading-anchor" {...props}>
      {id && (
        <a className="anchor-link" href={`#${id}`} aria-label="Link to this section">
          <Link2 aria-hidden />
        </a>
      )}
      {children}
    </Tag>
  );
}

/** Components available inside every MDX document. */
export const mdxComponents: MDXComponents = {
  CodeBlock,
  CodeTabs,
  Callout,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  ApiEndpoint,
  MethodBadge,
  ParamTable,
  ResponseExample,
  TryIt,
  Badge,
  Card,
  CardGrid,
  Flow,
  Steps,
  Step,
  FileTree,
  Figure,
  Kbd,
  Columns,
  Column,
  Checklist,
  Icon,
  RelatedLinks,
  Term,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  h4: (props) => <Heading level={4} {...props} />,
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
};
