import { useState } from "react";
import profileTempData from "@/utils/profileTempData";
import Image from "next/image";
import ProfileSection from "@/components/profileSection";
import Link from "next/link";

const Profile = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [addPicture, setAddPicture] = useState(false);

  const handleMouseOver = () => {
    setAddPicture(true);
  };
  const handleMouseOut = () => {
    setAddPicture(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-purple-600 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white">
      <Link href={"/"}>
        <Image
          src="/logo/png/logo-no-background-pink.png"
          width={125}
          height={125}
          alt="logo"
          className="flex self-start pt-4"
        />
      </Link>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-rose-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="backdrop-blur-sm bg-white/80 rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start flex-col ">
            <div
              className="relative rounded-full overflow-hidden"
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <Image
                src={profileTempData.profilePicture}
                width={175}
                height={175}
                alt="profile picture"
                className={` filter ${addPicture ? "opacity-50" : ""}`}
              />
              {addPicture && (
                <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <button className="bg-white rounded-full text-sm text-purple-500 px-4 py-2">
                    Fotoğraf Ekle
                  </button>
                </div>
              )}
            </div>

            <div className="pb-2 flex flex-col min-w-full">
              <h1 className="text-3xl font-bold text-red-500">
                {profileTempData.petName}
              </h1>
              <div className="text-gray-600">{profileTempData.petLocation}</div>
            </div>
            <button
              className="bg-purple-900 hover:bg-red-700 text-white px-2 py-1 rounded-full shadow"
              onClick={() => setShowEditForm(true)}
            >
              Profili Duzenle
            </button>

            <ProfileSection
              title="Hakkında"
              content={profileTempData.petAbout}
            />

            <ProfileSection
              title="Davranış sorunları"
              content={profileTempData.petBehaviorIssues}
            />
            <ProfileSection
              title="Özel ihtiyaçları"
              content={profileTempData.petSpecialNeeds}
            />
          </div>
          <div className="flex items-start flex-col ">
            <ProfileSection title="Türü" content={profileTempData.petBreed} />
            <ProfileSection title="Yaşı" content={profileTempData.petAge} />
            <ProfileSection
              title="Ağırlığı"
              content={profileTempData.petWeight}
            />
            <ProfileSection title="Cinsi" content={profileTempData.petType} />
            <ProfileSection
              title="Kısırlaştırıldı mı?"
              content={profileTempData.petSpayed}
            />
            <ProfileSection
              title="Aşıları tam mı?"
              content={profileTempData.petVaccinated}
            />
            <ProfileSection
              title="Çipli mi?"
              content={profileTempData.petMicrochipped}
            />
            <ProfileSection
              title="Diyet"
              content={profileTempData.petDietaryRestrictions}
            />
            <ProfileSection
              title="Alerjileri"
              content={profileTempData.petAllergies}
            />
            <ProfileSection
              title="İlaçları"
              content={profileTempData.petMedications}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
export default Profile;
