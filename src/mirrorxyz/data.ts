// Types for Mirror posts and transactions
import { MirrorPath } from ".";
import formatPost from "./formatPost";
import queries from "./queries";

type CalledFrom = "server" | "client";

// Fetches paths (transaction IDs) of entries published by a given address
const postPaths = async (address: string): Promise<MirrorPath[]> => {
  // Perform a GraphQL query to fetch transactions associated with the address
  const {
      data: {
        transactions: { edges },
      },
    } = await queries.transactions(address),
    // Map over the edges to extract and format relevant information from each transaction
    result = edges
      .map(({ node }) => {
        // Convert the tags array to a more accessible object format
        const tags = Object.fromEntries(
          node.tags.map((tag) => [tag.name, tag.value])
        );

        // Return an object containing the slug, path (transaction ID), and timestamp for each entry
        return {
          slug: tags["Original-Content-Digest"],
          transaction: node.id,
          timestamp: node.block.timestamp,
        };
      })
      // Filter out any entries without a valid slug and reduce the array to unique slugs,
      // updating the timestamp to the latest one if duplicates are found
      .filter((entry) => entry.slug && entry.slug !== "")
      .reduce((acc, current) => {
        const x = acc.findIndex((entry: any) => entry.slug === current.slug);
        if (x == -1) return acc.concat([current]);
        else {
          acc[x].timestamp = current.timestamp;
          return acc;
        }
      }, [] as MirrorPath[]);

  return result;
};

// Fetches and formats entries (posts) published by a given address
const posts = async (publicationAddress: string, calledFrom: CalledFrom) => {
  // Get the paths (transaction IDs) of all entries
  const paths = await postPaths(publicationAddress),
    // Fetch, parse, and format each entry based on its path, then sort them by timestamp
    result = (
      await Promise.all(
        paths.map(async (entry) =>
          formatPost({
            entry: await queries.post(entry.transaction),
            transactionId: entry.slug,
            timestamp: entry.timestamp,
            publicationAddress,
            calledFrom,
          })
        )
      )
    )
      // Sort entries by timestamp, latest first
      .sort((a, b) => b.timestamp - a.timestamp)
      // Reduce to an array of unique slugs (unique entries)
      .reduce((acc, current) => {
        const x = acc.find((entry) => entry.slug === current.slug);
        if (!x) return acc.concat([current]);
        else return acc;
      }, [] as Awaited<ReturnType<typeof formatPost>>[]);

  return result;
};

// Fetches and formats a single entry (post) based on its content digest
const post = async (
  transaction: string,
  publicationAddress: string,
  calledFrom: CalledFrom
) => {
  // Perform a GraphQL query to fetch a single transaction by its digest
  const {
    data: {
      transactions: {
        edges: [
          {
            node: {
              id: transactionId,
              block: { timestamp },
            },
          },
        ],
      },
    },
  } = await queries.singleTransaction(transaction);

  const entry = await queries.post(transactionId),
    // Fetch, parse, and format the entry data based on the transaction ID
    formatted = await formatPost({
      entry,
      transactionId: transaction,
      timestamp,
      publicationAddress,
      calledFrom,
    });

  return formatted;
};

const publication = async (publicationAddress: string) => {
  const res = await queries.publication(publicationAddress);
  return res.data.projectFeed;
};

export default {
  postPaths,
  posts,
  post,
  publication,
};
