import { OgObject } from "../ogs/types";

export type Edge = {
  node: {
    id: string;
    block: {
      timestamp: number;
    };
    tags: {
      name: string;
      value: string;
    }[];
  };
};

export type Transactions = {
  edges: Edge[];
};

export type TransactionsResponse = {
  data: {
    transactions: Transactions;
  };
};

export type MirrorPath = {
  slug: string;
  transaction: string;
  timestamp: number;
};

export type MirrorPost = {
  content: {
    body: string;
    timestamp: string;
    title: string;
  };
  digest: string;
  originalDigest?: string;
  authorship: {
    contributor: string;
    signingKey: string;
    signature: string;
    signingKeySignature: string;
    signingKeyMessage: string;
    algorithm: {
      name: string;
      hash: string;
    };
  };
  version: string;
};

export type FormattedMirrorPost = {
  title: string;
  slug: string;
  body: string;
  timestamp: number;
  digest: string;
  contributor: string;
  transaction: string;
  cover_image: string | null;
  oGData: OgObject | null;
};

export type Publication = {
  displayName: string;
  avatarURL: string;
  domain: any;
  headerImage: {
    url: string;
  };
  theme: {
    colorMode: string;
    accent: string;
  };
  description: string;
  mailingListURL: any;
  members: Array<{
    address: string;
    displayName: string;
    avatarURL: string;
  }>;
};

export type PublicationResponse = {
  data: {
    projectFeed: Publication;
  };
};
