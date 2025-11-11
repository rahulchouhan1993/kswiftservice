import { useEffect, useState } from "react";
import axios from "axios";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import MultiSelectDropdownCheckBox from "@/Components/MultiSelectDropdownCheckBox";
import MultiSelectDropdownCheckBoxGroupd from "./MultiSelectDropdownCheckBoxGroupd";

export default function CategorySubcategorySelector({
    data,
    setData,
    errors,
    categoryRequired = false,
    subCategoryRequired = false,
    sleected_cat,
    sleected_subcat
}) {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [subCategoriesGrouped, setSubCategoriesGrouped] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(route("common.get.categories"));
            const mapped = response.data.map(cat => ({ value: cat.id, label: cat.name }));
            setCategories(mapped);

            if (data.categories?.length > 0) {
                const preselected = mapped.filter(c => data.categories.includes(c.value));
                setSelectedCategories(preselected);
                fetchSubCategories(data.categories, true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubCategories = async (categoryIds, preload = false) => {
        const ids = (categoryIds || []).map(s => (s.value ?? s)).filter(Boolean);
        if (!ids.length) {
            setSubCategoriesGrouped([]);
            setSelectedSubCategories([]);
            if (!preload) setData("sub_categories", []);
            return;
        }

        try {
            const response = await axios.get(route("common.get.subcategories") + `?ids=${ids.join(",")}`);
            const subcategories = response.data;

            const grouped = ids.map(catId => {
                let cat = categories.find(c => c.value === catId);
                if (!cat && sleected_cat) {
                    const catArray = Array.isArray(sleected_cat) ? sleected_cat : [sleected_cat];
                    const sel = catArray.find(c => (c.value ?? c.id) === catId);
                    if (sel) cat = { value: sel.value ?? sel.id, label: sel.name ?? sel.label };
                }
                const label = cat?.label || `Category ${catId}`;
                return {
                    label,
                    options: subcategories
                        .filter(sub => sub.category_id === catId)
                        .map(sub => ({ value: sub.id, label: sub.name })),
                };
            });

            setSubCategoriesGrouped(grouped);

            if (preload) {
                let preselectedSubs = [];
                if (sleected_subcat?.length > 0) {
                    const subIds = sleected_subcat.map(s => s.value ?? s.id);
                    preselectedSubs = grouped.flatMap(g => g.options.filter(o => subIds.includes(o.value)));
                } else if (data.sub_categories?.length > 0) {
                    preselectedSubs = grouped.flatMap(g => g.options.filter(o => data.sub_categories.includes(o.value)));
                }
                if (preselectedSubs.length > 0) {
                    setSelectedSubCategories(preselectedSubs);
                    setData("sub_categories", preselectedSubs.map(s => s.value));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCategoryChange = selected => {
        setSelectedCategories(selected);
        const ids = (selected || []).map(s => s.value ?? s).filter(Boolean);
        setData("categories", ids);
        fetchSubCategories(ids);
    };

    const handleSubCategoryChange = values => {
        const selected = subCategoriesGrouped.flatMap(g => g.options.filter(o => values.includes(o.value)));
        setSelectedSubCategories(selected);
        setData("sub_categories", values);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!categories.length || selectedCategories.length > 0) return;
        let cats = sleected_cat ? (Array.isArray(sleected_cat) ? sleected_cat : [sleected_cat])
            : data.categories?.length ? categories.filter(c => data.categories.includes(c.value))
            : [];
        if (cats.length) {
            setSelectedCategories(cats);
            const ids = cats.map(c => c.value ?? c.id);
            fetchSubCategories(ids, true);
        }
    }, [categories]);

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div className="w-full">
                <InputLabel value={`Category ${categoryRequired ? "*" : ""}`} />
                <MultiSelectDropdownCheckBox
                    options={categories}
                    selected={selectedCategories}
                    onChange={handleCategoryChange}
                    placeholder="Select Categories"
                    required={categoryRequired}
                />
                <InputError className="mt-2" message={errors.categories} />
            </div>

            <div className="w-full">
                <InputLabel value={`Sub Category ${subCategoryRequired ? "*" : ""}`} />
                <MultiSelectDropdownCheckBoxGroupd
                    groups={subCategoriesGrouped}
                    selected={selectedSubCategories.map(s => s.value)}
                    onChange={handleSubCategoryChange}
                    placeholder="Select Sub Categories"
                    required={subCategoryRequired}
                />
                <InputError className="mt-2" message={errors.sub_categories} />
            </div>
        </div>
    );
}
