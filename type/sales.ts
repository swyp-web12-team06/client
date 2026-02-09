export type SalesHistoryItem = {
  prompt_id: number;
  title: string;
  price: number;
  status: 'APPROVED' | 'HIDDEN';
  preview_image_url: string;
  sales_count: number;
  total_revenue: number;
  created_at: string;
};
