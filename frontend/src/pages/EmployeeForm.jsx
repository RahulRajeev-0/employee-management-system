import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Navbar from '../components/Navbar';

const SortableItem = ({ field, index, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center bg-white p-3 rounded-md border border-gray-200 shadow-sm">
      <div className="mr-3 cursor-move text-gray-400">≡</div>
      <div className="flex-1">
        <div className="font-medium">{field.label}</div>
        <div className="text-sm text-gray-500">{field.type}</div>
      </div>
      <button
        type="button"
        className="text-red-500 hover:text-red-700"
        onClick={() => onDelete(field.id)}
      >
        Delete
      </button>
    </div>
  );
};

const EmployeeForm = () => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  const handleAddField = () => {
    if (newFieldLabel.trim() === '') return;

    const newField = {
      id: `field-${Date.now()}`,
      label: newFieldLabel,
      type: newFieldType
    };

    setFields([...fields, newField]);
    setNewFieldLabel('');
    setNewFieldType('text');
  };

  const handleDeleteField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formTemplate = {
      name: templateName,
      description,
      fields
    };
    console.log('Form template to submit:', formTemplate);
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'textarea', label: 'Text Area' }
  ];

  return (
  <>
        <Navbar/>
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Form Template</h1>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">

        <div className="mb-8">
          <label htmlFor="templateName" className="block text-lg font-medium text-gray-700 mb-2">
            Template Name
          </label>
          <input
            type="text"
            id="templateName"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            required
            />
        </div>

        <div className="mb-8">
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-medium mb-4">Add New Field</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Field Label"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddField}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Field
            </button>
          </div>
        </div>

        {fields.length > 0 && (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {fields.map((field, index) => (
                    <SortableItem key={field.id} field={field} index={index} onDelete={handleDeleteField} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <div className="mt-10 text-right">
          <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Save Template
          </button>
        </div>
      </form>
    </div>
        </>
  );
};

export default EmployeeForm;