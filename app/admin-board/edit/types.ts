// Defines the shape of the data we work with in the edit form

export interface Flavor {
  id: string;
  slug: string;
  description: string | null;
}

export interface Step {
  id: number;
  humor_flavor_id: number;
  description: string | null;
  order_by: number;
  llm_system_prompt: string | null;
  llm_user_prompt: string | null;
  llm_temperature: number | null;
  // Add all other fields from your schema
  llm_input_type_id: number;
  llm_output_type_id: number;
  llm_model_id: number;
  humor_flavor_step_type_id: number;
  created_datetime_utc: string;
  modified_datetime_utc: string;
  created_by_user_id: string;
  modified_by_user_id: string;
}
