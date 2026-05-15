export type FeedPaper = {
  id: string;
  title: string;
  inputType: string;
  pdfUrl: string | null;
  sourceUrl: string | null;
  status: string;
  createdAt: string;
  result?: {
    summary?: {
      title?: string;
      category?: string;
      difficulty?: string;
      oneLineSummary?: string;
      problemSolved?: string;
      methodUsed?: string;
    };
    concepts?: string[];
    relatedTopics?: string[];
  } | null;
};
