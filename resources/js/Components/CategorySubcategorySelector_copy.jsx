import { useEffect, useState } from "react";
import axios from "axios";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import MultiSelectDropdownCheckBox from "@/Components/MultiSelectDropdownCheckBox";
import MultiSelectDropdownCheckBoxGroupd from "./MultiSelectDropdownCheckBoxGroupd";

export default function CategorySubcategorySelector_copy({
    data,
    setData,
    errors,
    categoryRequired = false,
    subCategoryRequired = false,
    sleected_cat,
}) {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [subCategoriesGrouped, setSubCategoriesGrouped] = useState([]);

    useEffect(() => {
        if (!sleected_cat) return;
        const cats = Array.isArray(sleected_cat) ? sleected_cat : [sleected_cat];

        setSelectedCategories(cats);
        const ids = cats.map((c) => (c.value !== undefined ? c.value : c.id));
        fetchSubCategories(ids, true);
    }, [sleected_cat]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(route("common.get.categories"));
            const mapped = response.data.map((cat) => ({
                value: cat.id,
                label: cat.name,
            }));
            setCategories(mapped);
            if (data.categories?.length > 0) {
                const preselected = mapped.filter((c) =>
                    data.categories.includes(c.value)
                );
                setSelectedCategories(preselected);
                fetchSubCategories(data.categories, true);
            }
        } catch (err) {
            console.error("❌ Failed to fetch categories:", err);
        }
    };

    const fetchSubCategories = async (categoryIds, preload = false) => {
        const ids = (categoryIds || [])
            .map((s) => (s.value !== undefined ? s.value : s))
            .filter(Boolean);

        if (ids.length === 0) {
            setSubCategories([]);
            setSubCategoriesGrouped([]);
            setSelectedSubCategories([]);
            if (!preload) setData("sub_categories", []);
            return;
        }

        try {
            const response = await axios.get(
                route("common.get.subcategories") + `?ids=${ids.join(",")}`
            );

            const subcategories = response.data;

            // ✅ Group by category_id
            const grouped = ids.map((catId) => {
                const cat = categories.find((c) => c.value === catId);
                return {
                    label: cat ? cat.label : `Category ${catId}`,
                    options: subcategories
                        .filter((sub) => sub.category_id === catId)
                        .map((sub) => ({ value: sub.id, label: sub.name })),
                };
            });

            setSubCategoriesGrouped(grouped);

            // ✅ Preselect subcategories if editing
            if (preload) {
                let preselectedSubs = [];

                // Case 1: Use data.sub_categories (array of IDs)
                if (data.sub_categories?.length > 0) {
                    preselectedSubs = grouped.flatMap((g) =>
                        g.options.filter((o) => data.sub_categories.includes(o.value))
                    );
                }

                // Case 2: If sleected_cat already has subcategories
                if (
                    preselectedSubs.length === 0 &&
                    sleected_cat &&
                    (Array.isArray(sleected_cat) ? sleected_cat : [sleected_cat])
                        .some((c) => c.subcategories)
                ) {
                    const catArray = Array.isArray(sleected_cat)
                        ? sleected_cat
                        : [sleected_cat];
                    const subIds = catArray.flatMap((c) =>
                        (c.subcategories || []).map((s) => s.id)
                    );

                    preselectedSubs = grouped.flatMap((g) =>
                        g.options.filter((o) => subIds.includes(o.value))
                    );
                }

                if (preselectedSubs.length > 0) {
                    setSelectedSubCategories(preselectedSubs);
                    setData("sub_categories", preselectedSubs.map((s) => s.value));
                }
            }
        } catch (err) {
            console.error("❌ Failed to fetch subcategories:", err);
        }
    };


    const handleCategoryChange = (selected) => {
        setSelectedCategories(selected);
        const ids = (selected || [])
            .map((s) => (s.value !== undefined ? s.value : s))
            .filter(Boolean);
        setData("categories", ids);
        fetchSubCategories(ids);
    };

    const handleSubCategoryChange = (selected) => {
        setSelectedSubCategories(selected);
        const ids = (selected || [])
            .map((s) => (s.value !== undefined ? s.value : s))
            .filter(Boolean);
        setData("sub_categories", ids);
    };

    // Load categories first
    useEffect(() => {
        fetchCategories();
    }, []);

    // Run preload only when categories are loaded
    useEffect(() => {
        if (!categories.length) return;

        let cats = [];

        if (sleected_cat) {
            cats = Array.isArray(sleected_cat) ? sleected_cat : [sleected_cat];
        } else if (data.categories?.length > 0) {
            cats = categories.filter((c) => data.categories.includes(c.value));
        }

        if (cats.length > 0) {
            setSelectedCategories(cats);
            const ids = cats.map((c) => c.value ?? c.id);
            fetchSubCategories(ids, true); // ✅ now categories are available
        }
    }, [categories, sleected_cat, data.categories]);

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="w-full">
                <InputLabel
                    value={`Category ${categoryRequired ? "*" : ""}`}
                />
                <MultiSelectDropdownCheckBox
                    options={categories}
                    selected={selectedCategories}
                    onChange={handleCategoryChange}
                    placeholder="Select Categories"
                    required={categoryRequired}
                />
                <InputError className="mt-2" message={errors.categories} />
            </div>

            {/* Sub Category */}
            <div className="w-full">
                <InputLabel
                    value={`Sub Category ${subCategoryRequired ? "*" : ""}`}
                />
                <MultiSelectDropdownCheckBoxGroupd
                    groups={subCategoriesGrouped}
                    selected={selectedSubCategories.map((s) => s.value)}
                    onChange={(values) => {
                        const selected = subCategoriesGrouped.flatMap((g) =>
                            g.options.filter((o) => values.includes(o.value))
                        );
                        setSelectedSubCategories(selected);
                        setData("sub_categories", values);
                    }}
                    placeholder="Select Sub Categories"
                    required={subCategoryRequired}
                />
                <InputError
                    className="mt-2"
                    message={errors.sub_categories}
                />
            </div>
        </div>
    );
}
