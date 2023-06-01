import { notFound } from "next/navigation";
import { SITE_URL } from "@/utils/const";
import Container from "@/components/container";
import { Example } from "@/utils/type";
import getData from "../get-data";
import markdownToHtml from "@/utils/markdownToHtml";
import Balancer from "react-wrap-balancer";
import Button from "@/components/button";
import authors from "@/utils/authors";
import IconRedis from "@/components/icon-redis";
import IconKafka from "@/components/icon-kafka";
import IconQStash from "@/components/icon-qstash";
import { HTMLProps } from "react";
import Link from "next/link";
import { ICON_NAMES } from "@/components/icon";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  const examples: Example[] = await getData();

  return examples.map((item) => ({
    slug: item.title.toLowerCase().replace(/ /g, "-"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Props["params"];
}) {
  const examples: Example[] = await getData();
  const example = examples.find(
    (item) => item.title.toLowerCase().replace(/ /g, "-") === params.slug
  );

  if (!example) {
    return {
      title: "Not found",
    };
  }

  const title = example.title;
  const url = `${SITE_URL}/examples/${example.title
    .toLowerCase()
    .replace(/ /g, "-")}`;

  return {
    title,
  };
}

export default async function BlogPage({ params }: Props) {
  const examples: Example[] = await getData();
  const example = examples.find(
    (item) => item.title.toLowerCase().replace(/ /g, "-") === params.slug
  );

  if (!example) {
    notFound();
  }

  const author = authors[example.author];
  const content = await markdownToHtml(example.body);

  return (
    <main className="pt-8 md:pt-16">
      <Container>
        <div className="grid gap-8 text-left md:grid-cols-3 md:gap-16">
          {/* meta */}
          <div className="order-2 md:order-1">
            <Link href="/examples" className="mb-4 hidden opacity-80 md:block">
              ← Back to Examples
            </Link>

            <div className="top-8 rounded-2xl bg-white/5 p-6 md:sticky">
              <div className="">
                <ExampleMetaRow title="Products">
                  <>
                    {example.products.map((item) => {
                      if (item === "redis") {
                        return (
                          <span
                            key={item}
                            className="flex items-center gap-2 rounded
                            bg-red-400/10 p-1.5 pr-2 leading-none text-red-200"
                          >
                            <IconRedis
                              width={16}
                              aria-label="Upstash Redis Icon"
                            />
                            <span>Redis</span>
                          </span>
                        );
                      } else if (item === "kafka") {
                        return (
                          <span
                            key={item}
                            className="flex items-center gap-2 rounded
                            bg-red-400/10 p-1.5 pr-2 leading-none text-red-200"
                          >
                            <IconKafka
                              width={16}
                              aria-label="Upstash Kafka Icon"
                            />
                            <span>Kafka</span>
                          </span>
                        );
                      } else if (item === "qstash") {
                        return (
                          <span
                            key={item}
                            className="flex items-center gap-2 rounded
                            bg-red-400/10 p-1.5 pr-2 leading-none text-red-200"
                          >
                            <IconQStash
                              width={16}
                              aria-label="Upstash QStash Icon"
                            />
                            <span>QStash</span>
                          </span>
                        );
                      }
                    })}
                  </>
                </ExampleMetaRow>

                <ExampleMetaRow title="Stack">
                  <>
                    {example.stack
                      .map((item) => {
                        return item;
                      })
                      .join(", ")}
                  </>
                </ExampleMetaRow>

                <ExampleMetaRow title="Use Case">
                  <>
                    {example.useCases
                      .map((item) => {
                        return item;
                      })
                      .join(", ")}
                  </>
                </ExampleMetaRow>

                <ExampleMetaRow title="Publisher">
                  <>{author.name}</>
                </ExampleMetaRow>
              </div>

              <div className="mt-4 grid gap-4">
                <Button
                  type="button"
                  href="mailto:jobs@upstash.com"
                  iconProps={{
                    icon: ICON_NAMES.ArrowRight,
                  }}
                >
                  Read Post
                </Button>

                <Button
                  type="button"
                  target="_blank"
                  href={example.githubUrl}
                  icon={
                    <svg
                      height="20"
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      version="1.1"
                      fill="currentColor"
                    >
                      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                    </svg>
                  }
                >
                  View Repo
                </Button>

                <Button
                  type="button"
                  href="mailto:jobs@upstash.com"
                  className="bg-white text-zinc-950"
                  // className="bg-emerald-400 text-zinc-950"
                >
                  Deploy
                </Button>
              </div>
            </div>
          </div>

          {/* post */}
          <div className="order-1 md:col-span-2 md:pt-10">
            <Link href="/examples" className="mb-8 block opacity-60 md:hidden">
              ← Back to Examples
            </Link>

            <article>
              <h1 className="font-display text-4xl font-bold !leading-title md:text-5xl">
                <Balancer>{example.title}</Balancer>
              </h1>

              <div
                className="post mt-8 leading-p"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </article>
          </div>
        </div>
      </Container>
    </main>
  );
}

function ExampleMetaRow({
  className,
  children,
  title,
  ...props
}: HTMLProps<HTMLDivElement> & {
  title: string;
}) {
  return (
    <div className="flex items-center border-b border-b-white/5 py-3">
      <div className="text-xs uppercase tracking-widest opacity-40">
        {title}:
      </div>
      <div className="ml-auto flex items-center">{children}</div>
    </div>
  );
}
