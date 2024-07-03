export const ProfileField = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {" "}
      {label}
    </label>
    <p className="text-gray-700">{value || "Not provided"} </p>
  </div>
);
//user profile type
export type UserProfile = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  sex: string;
  date_of_birth: string | null;
  height: number | null;
  weight: number | null;
  is_imperial: boolean | null;
  email: string | null;
  created_at: string | null;
  username: string | null;
  password: string | null;
};
