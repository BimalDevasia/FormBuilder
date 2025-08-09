# 🚀 Dynamic Form Builder

A modern, responsive form builder application built with React, TypeScript, Material-UI, and Redux Toolkit. Create, customize, and manage dynamic forms with an intuitive drag-and-drop interface.

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop Interface**: Intuitive field placement with @dnd-kit
- **Real-time Preview**: Live form preview as you build
- **Form Persistence**: Save and load forms with localStorage
- **Responsive Design**: Mobile-first design with collapsible sidebar
- **Field Validation**: Comprehensive validation using Zod schemas

### 📝 Field Types
- **Text Input** with custom validation and password rules
- **Email** with built-in validation
- **Number** with min/max constraints
- **Textarea** for long-form content
- **Select** dropdown with custom options
- **Radio Buttons** with multiple choices
- **Checkboxes** (single and grouped)
- **Date Picker** for date selection
- **Derived Fields** with automatic calculations

### 🔧 Advanced Features
- **Derived Fields**: Calculate values based on other fields (age from DOB, sum, difference, custom formulas)
- **Password Validation**: Configurable rules (min 8 chars, numbers, uppercase, special chars)
- **Checkbox Groups**: Multiple checkbox options with custom values
- **Field Reordering**: Drag to reorder form fields
- **Form Management**: Save, load, edit, and delete forms
- **Navigation**: Three-route architecture (/create, /preview, /myforms)

### 🎨 Design & UX
- **Modern UI**: Clean, professional interface with Material-UI components
- **Animations**: Smooth transitions with Framer Motion
- **Typography**: Poppins font for modern aesthetics
- **Theming**: Consistent color scheme and spacing
- **Accessibility**: Semantic HTML and ARIA labels

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1 + TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI v7
- **Styling**: Tailwind CSS 4.1.11
- **Form Handling**: React Hook Form
- **Validation**: Zod schemas
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
formbuilder/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AppLayout.tsx    # Main app layout with navigation
│   │   ├── FieldPalette.tsx # Draggable field types palette
│   │   ├── FieldProperties.tsx # Field configuration panel
│   │   ├── FieldRenderer.tsx   # Individual field rendering
│   │   ├── FormCanvas.tsx      # Main form building area
│   │   ├── FormField.tsx       # Form field wrapper
│   │   ├── FormPreview.tsx     # Live form preview
│   │   └── FormBuilderLayout.tsx # Builder layout container
│   ├── pages/               # Route components
│   │   ├── FormBuilderPage.tsx # /create route
│   │   ├── PreviewPage.tsx     # /preview route
│   │   └── MyFormsPage.tsx     # /myforms route
│   ├── store/               # Redux state management
│   │   ├── index.ts         # Store configuration
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   └── formBuilderSlice.ts # Form builder state slice
│   ├── utils/               # Utility functions
│   │   └── validation.ts    # Zod validation schemas
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd formbuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Creating a Form

1. **Navigate to Create** (`/create`)
2. **Add Form Details**: Enter title and description
3. **Add Fields**: Drag field types from the left palette
4. **Configure Fields**: Click on fields to set properties, validation, and options
5. **Preview**: Use the preview feature to test your form
6. **Save**: Click "Save Form" to persist your form

### Field Configuration

#### Basic Settings
- **Label**: Display name for the field
- **Placeholder**: Hint text for users
- **Required**: Make field mandatory

#### Validation Options
- **Text Fields**: Min/max length, regex patterns, password rules
- **Number Fields**: Min/max values
- **Email Fields**: Built-in email validation

#### Advanced Features
- **Derived Fields**: Create calculated fields based on other form data
- **Checkbox Groups**: Multiple related checkboxes with custom values
- **Options**: Configure dropdown and radio button choices

### Managing Forms

1. **My Forms** (`/myforms`): View all saved forms
2. **Preview**: Click any form to preview it
3. **Edit**: Use the edit button to modify existing forms
4. **Delete**: Remove forms you no longer need

## 🔧 API Reference

### Redux Store Structure

```typescript
interface FormState {
  title: string;                    // Form title
  description: string;              // Form description
  fields: FormField[];              // Array of form fields
  isPreviewMode: boolean;           // Preview mode toggle
  selectedFieldId: string | null;   // Currently selected field
  savedForms: SavedForm[];          // Saved forms array
  currentFormId: string | null;     // Current form ID when editing
}

interface FormField {
  id: string;                       // Unique field identifier
  type: FieldType;                  // Field type enum
  label: string;                    // Field display label
  placeholder?: string;             // Field placeholder text
  required: boolean;                // Required field flag
  options?: string[];               // Options for select/radio fields
  validation?: ValidationRules;     // Field validation configuration
  order: number;                    // Field display order
  // Derived field properties
  isDerived?: boolean;              // Derived field flag
  parentFields?: string[];          // Parent field IDs
  derivationFormula?: string;       // Calculation formula
  derivationType?: DerivaationType; // Type of derivation
  // Grouping properties
  groupName?: string;               // Field group name
  groupOptions?: GroupOption[];     // Grouped field options
}
```

### Available Actions

```typescript
// Form actions
setFormTitle(title: string)
setFormDescription(description: string)
saveForm()
newForm()
loadForm(formId: string)
deleteForm(formId: string)

// Field actions
addField(field: Omit<FormField, 'id' | 'order'>)
updateField({ id: string, updates: Partial<FormField> })
deleteField(fieldId: string)
reorderFields(fields: FormField[])
duplicateField(fieldId: string)
setSelectedField(fieldId: string | null)

// UI actions
togglePreviewMode()
clearForm()
```

## 🎨 Customization

### Theming
The app uses Material-UI's theming system. Customize colors, typography, and spacing in `src/main.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // Customize primary color
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Customize font
  },
});
```

### Styling
- **Material-UI**: Component-level styling with `sx` prop
- **Tailwind CSS**: Utility classes for rapid styling
- **CSS Variables**: Custom properties for consistent theming

### Adding New Field Types

1. **Update FormField interface** in `formBuilderSlice.ts`
2. **Add field to FieldPalette** component
3. **Implement rendering** in `FieldRenderer.tsx`
4. **Add validation** in `utils/validation.ts`
5. **Configure properties** in `FieldProperties.tsx`

## 🔍 Validation System

The app uses Zod for type-safe validation:

```typescript
// Text field validation
const textSchema = z.string()
  .min(minLength, 'Minimum length required')
  .max(maxLength, 'Maximum length exceeded')
  .regex(pattern, 'Invalid format');

// Password validation
const passwordSchema = z.string()
  .min(8, 'Minimum 8 characters')
  .regex(/(?=.*\d)/, 'Must contain number')
  .regex(/(?=.*[A-Z])/, 'Must contain uppercase')
  .regex(/(?=.*[!@#$%^&*])/, 'Must contain special character');
```

## 📱 Responsive Design

- **Mobile-first**: Designed for mobile devices with progressive enhancement
- **Breakpoints**: 
  - `xs`: 0px - 599px (Mobile)
  - `sm`: 600px - 959px (Tablet)
  - `md`: 960px - 1279px (Small Desktop)
  - `lg`: 1280px+ (Large Desktop)
- **Collapsible Sidebar**: Field palette becomes a slide-out sidebar on mobile
- **Touch-friendly**: Optimized for touch interactions

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist/` folder to your hosting provider

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Maintain responsive design principles
- Add proper error handling
- Update documentation for new features

## 📋 Roadmap

- [ ] **User Authentication**: Multi-user support with accounts
- [ ] **Form Submissions**: Backend integration for form responses
- [ ] **Templates**: Pre-built form templates
- [ ] **Advanced Validations**: Cross-field validation rules
- [ ] **Conditional Logic**: Show/hide fields based on conditions
- [ ] **File Uploads**: Support for file upload fields
- [ ] **Form Analytics**: Response analytics and insights
- [ ] **Export Options**: PDF/Excel export functionality
- [ ] **API Integration**: REST API for form management
- [ ] **Multi-language**: Internationalization support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Material-UI** for beautiful components
- **Redux Toolkit** for state management
- **Tailwind CSS** for utility-first styling
- **Vite** for lightning-fast development
- **TypeScript** for type safety

## 📞 Support

If you have any questions or need help:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Start a discussion** for general questions

---

**Built with ❤️ using React, TypeScript, and Material-UI**

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.0-blue.svg)](https://mui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Latest-blue.svg)](https://vitejs.dev/)
