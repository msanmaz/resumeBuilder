// src/components/LeftSidebar.js
import { User, FileText, BookOpen, Briefcase, Code, GripVertical, LayoutTemplate } from 'lucide-react';
import { useResume } from '../context/resumeContext/useResume';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { defaultNavigationItems } from '../context/resumeContext/resumeConstants';
import { useNavigate } from 'react-router-dom';

// Map of icons to their components
const iconComponents = { User, FileText, BookOpen, Briefcase, Code };

const LeftSidebar = () => {
  const { state, dispatch, actions } = useResume();
  const navigate = useNavigate();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = [...state.ui.sectionOrder];
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);
    dispatch(actions.setSectionOrder(items));
  };

  const handleSectionChange = (sectionId) => {
    dispatch(actions.setSection(sectionId));
  };

  const navigationItems = Array.isArray(state.ui.sectionOrder)
    ? state.ui.sectionOrder
    : defaultNavigationItems;

  return (
    <div className="w-64 bg-neutral-900 h-screen flex flex-col">
      <div className="flex-1 p-6">
        <div className="text-xl font-semibold text-white mb-8 cursor-pointer" onClick={() => navigate('/')}>Resume Builder</div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {navigationItems.map(({ id, label, icon }, index) => {
                  const Icon = iconComponents[icon];
                  return (
                    <Draggable key={id} draggableId={String(id)} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            p-3 rounded-lg
                            ${snapshot.isDragging ? 'bg-neutral-700 shadow-lg' : ''}
                            ${state.ui.currentSection === id
                              ? 'bg-primary-500 text-white'
                              : 'text-neutral-300 hover:bg-neutral-700'
                            }
                          `}
                          onClick={() => handleSectionChange(id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon size={20} />
                              <span>{label}</span>
                            </div>
                            <GripVertical
                              size={16}
                              className={`
                                  opacity-50 hover:opacity-100 transition-opacity
                                  ${snapshot.isDragging ? 'opacity-100' : ''}
                                `}
                            />
                          </div>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Created Resumes and Template Selection Buttons */}
      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={() => navigate('/resumes')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
                     bg-neutral-800 hover:bg-neutral-700 
                     text-neutral-300 hover:text-white 
                     rounded-lg transition-colors mb-2" // Added margin-bottom for spacing
        >
          <FileText size={20} />
          <span>Created Resumes</span>
        </button>
        <button
          onClick={() => navigate('/templates')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
                     bg-neutral-800 hover:bg-neutral-700 
                     text-neutral-300 hover:text-white 
                     rounded-lg transition-colors"
        >
          <LayoutTemplate size={20} />
          <span>Change Template</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;