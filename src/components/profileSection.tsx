type SectionProps = {
  title: string;
  content: string;
};

const ProfileSection = ({ title, content }: SectionProps) => {
  return (
    <div className="mt-4">
      <div className="text-gray-600 font-medium text-sm mb-1">{title}:</div>
      <div className="text-md font-normal text-gray-800">{content}</div>
    </div>
  );
};

export default ProfileSection;
