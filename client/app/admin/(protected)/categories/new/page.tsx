import { CategoryForm } from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Add New Category</h1>
            <CategoryForm />
        </div>
    );
}
