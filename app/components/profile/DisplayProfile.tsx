"use client";

import React from "react";
import { ProfileField } from "@/app/types/profile-types";
import Link from "next/link";
import { UserProfile } from "@/app/types/profile-types";

type DisplayProfileProps = {
  profile: UserProfile;
};

const DisplayProfile: React.FC<DisplayProfileProps> = ({ profile }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField label="First Name" value={profile.first_name} />
        <ProfileField label="Last Name" value={profile.last_name} />
        <ProfileField label="Username" value={profile.username || ""} />
        <ProfileField label="Email" value={profile.email || ""} />
        <ProfileField label="Sex" value={profile.sex} />
        <ProfileField
          label="Date of Birth"
          value={
            profile.date_of_birth
              ? new Date(profile.date_of_birth).toLocaleDateString()
              : ""
          }
        />
        <ProfileField
          label="Height"
          value={
            profile.height
              ? `${profile.height} ${profile.is_imperial ? "in" : "cm"}`
              : "Not provided"
          }
        />
        <ProfileField
          label="Weight"
          value={
            profile.weight
              ? `${profile.weight} ${profile.is_imperial ? "lbs" : "kg"}`
              : "Not provided"
          }
        />
        <ProfileField
          label="Measurement System"
          value={
            profile.is_imperial !== null
              ? profile.is_imperial
                ? "Imperial"
                : "Metric"
              : "Not set"
          }
        />
        <ProfileField
          label="Account Created"
          value={
            profile.created_at
              ? new Date(profile.created_at).toLocaleString()
              : "Not available"
          }
        />
      </div>
      <Link
        href="/profile/edit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
      >
        Edit profile
      </Link>
    </div>
  );
};

export default DisplayProfile;
