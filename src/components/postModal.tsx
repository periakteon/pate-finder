import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

type PostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Gönderi oluşturma işlemini burada gerçekleştirin
    // title, content ve selectedImage'i kullanarak gönderiyi kaydedebilirsiniz
    // Örneğin, bir API çağrısı yapabilir veya uygun bir işlevi çağırabilirsiniz
    // Gönderi oluşturulduktan sonra modalı kapatmak için onClose işlevini çağırabilirsiniz
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      contentLabel="Post Modal"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="mb-4 text-2xl font-bold text-black">Gönderi Ekle</h2>
        <textarea
          placeholder="Gönderi İçeriği"
          value={content}
          onChange={handleContentChange}
          className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
          rows={4}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        <button
          className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer mr-2"
          onClick={onClose}
        >
          Kapat
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
          onClick={handleSubmit}
          disabled={!content || !selectedImage}
        >
          Gönderi Oluştur
        </button>
      </div>
    </Modal>
  );
};

export default PostModal;
