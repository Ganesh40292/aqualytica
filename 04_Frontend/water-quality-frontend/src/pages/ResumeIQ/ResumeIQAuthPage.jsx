import ResumeIQAuth from "../../components/resumeiq/ResumeIQAuth";

const ResumeIQAuthPage = ({ onComplete }) => {
  return (
    <div className="w-full h-screen">
      <ResumeIQAuth onComplete={onComplete} />
    </div>
  );
};

export default ResumeIQAuthPage;
