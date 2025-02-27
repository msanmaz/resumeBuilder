const PreviewModal = ({ template, onClose }) => {

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the image or close button
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={template.previewImage}
          alt={template.name}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  )
};

export default PreviewModal;