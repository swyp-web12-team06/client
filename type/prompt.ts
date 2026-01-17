export type Prompt = {
  prompt_id: number;
  user_id: number;
  category_id: number;
  model_id: number;
  title: string;
  description: string;
  price: number;
  tier: string;
  master_prompt: string;
  status: string;
  preview_image_url: string;
  clip_score_avg: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};
