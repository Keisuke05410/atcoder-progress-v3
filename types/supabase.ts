export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      details: {
        Row: {
          code: string | null;
          detail_id: string;
          language: string | null;
          memo: string | null;
          problem_id: string;
        };
        Insert: {
          code?: string | null;
          detail_id?: string;
          language?: string | null;
          memo?: string | null;
          problem_id: string;
        };
        Update: {
          code?: string | null;
          detail_id?: string;
          language?: string | null;
          memo?: string | null;
          problem_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "details_problem_id_fkey";
            columns: ["problem_id"];
            referencedRelation: "problems";
            referencedColumns: ["problem_id"];
          }
        ];
      };
      problems: {
        Row: {
          contest_number: string;
          contest_type: string;
          correct: boolean;
          created_at: string;
          preview: boolean | null;
          problem_id: string;
          problem_number: string;
          problem_url: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          contest_number: string;
          contest_type: string;
          correct: boolean;
          created_at: string;
          preview?: boolean | null;
          problem_id?: string;
          problem_number: string;
          problem_url: string;
          updated_at: string;
          user_id: string;
        };
        Update: {
          contest_number?: string;
          contest_type?: string;
          correct?: boolean;
          created_at?: string;
          preview?: boolean | null;
          problem_id?: string;
          problem_number?: string;
          problem_url?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "problems_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_problem_and_detail: {
        Args: {
          p_user_id: string;
          p_contest_number: string;
          p_contest_type: string;
          p_correct: boolean;
          p_created_at: string;
          p_preview: boolean;
          p_problem_number: string;
          p_problem_url: string;
          p_updated_at: string;
          p_code: string;
          p_language: string;
          p_memo: string;
        };
        Returns: string;
      };
      get_related_data:
        | {
            Args: {
              contest_type_param: string;
              contest_number_param: string;
              problem_number_param: string;
              user_id_param: string;
            };
            Returns: {
              code: string;
              detail_id: string;
              language: string;
              memo: string;
              problem_id: string;
              contest_number: string;
              contest_type: string;
              correct: boolean;
              created_at: string;
              preview: boolean;
              problem_number: string;
              problem_url: string;
              updated_at: string;
              user_id: string;
            }[];
          }
        | {
            Args: {
              problem_id_param: string;
            };
            Returns: {
              code: string;
              detail_id: string;
              language: string;
              memo: string;
              problem_id: string;
              contest_number: string;
              contest_type: string;
              correct: boolean;
              created_at: string;
              preview: boolean;
              problem_number: string;
              problem_url: string;
              updated_at: string;
              user_id: string;
            }[];
          };
      search_problems: {
        Args: {
          optionmarked: boolean;
          optioncorrect: boolean;
          optiontoday: boolean;
          optionsearch: string;
          optionsort: boolean;
        };
        Returns: {
          contest_number: string;
          contest_type: string;
          correct: boolean;
          created_at: string;
          preview: boolean | null;
          problem_id: string;
          problem_number: string;
          problem_url: string;
          updated_at: string;
          user_id: string;
        }[];
      };
      update_problem_and_detail: {
        Args: {
          p_problem_id: string;
          p_contest_number: string;
          p_contest_type: string;
          p_correct: boolean;
          p_created_at: string;
          p_preview: boolean;
          p_problem_number: string;
          p_problem_url: string;
          p_updated_at: string;
          p_user_id: string;
          p_code: string;
          p_language: string;
          p_memo: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
