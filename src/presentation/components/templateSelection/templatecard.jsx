const TemplateCard = ({ template, onPreview, onSelect }) => (
  <div className="group relative bg-neutral-800/50 rounded-xl border border-neutral-700/50 transition-all duration-300 hover:bg-neutral-800/80 hover:border-neutral-600/50 hover:shadow-lg backdrop-blur-sm overflow-hidden">
    {/* Image Container */}
    <div className="relative aspect-[8.5/11] overflow-hidden cursor-pointer" onClick={() => onPreview(template)}>
      <img
        src={template.thumbnail}
        alt={template.name} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Template Name Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white font-medium">{template.name}</h3>
      </div>
    </div>

    {/* Button Container */}
    <div className="p-4 flex items-center gap-4">
      <button
        onClick={() => onPreview(template)}
        className="flex-1 px-4 py-2 text-sm text-neutral-200 border border-neutral-600 
                   rounded-md hover:bg-neutral-700/50 transition-colors"
      >
        Preview
      </button>
      <button
        onClick={() => onSelect(template)}
        className="flex-1 px-4 py-2 text-sm bg-violet-600 text-white 
                   rounded-md hover:bg-violet-700 transition-colors"
      >
        Select
      </button>
    </div>
  </div>
);

export default TemplateCard;