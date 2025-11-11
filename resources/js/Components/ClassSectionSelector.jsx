import { useEffect, useState } from "react";
import axios from "axios";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";
import { useHelpers } from "./Helpers";

export default function ClassSectionSelector({ data, setData, errors, schoolId, displaySections = true }) {
    const { getClassNameByPrefixType } = useHelpers();
    const [schoolClasses, setSchoolClasses] = useState([]);
    const [classSections, setClassSections] = useState([]);

    const fetchClasses = async () => {
        try {
            const response = await axios.get(route("common.get.school.classes", schoolId));
            const mapped = response.data.map(cls => ({
                value: cls.id,
                label: `${getClassNameByPrefixType(cls?.name, cls?.class_prefix?.prefix)}`,
            }));
            setSchoolClasses(mapped);
        } catch (err) {
            console.error("Failed to fetch school classes:", err);
        }
    };

    const handleClassChange = async (classId, keepSection = false) => {
        setData("class", classId);

        if (!keepSection) {
            setData("class_section", "");
        }

        if (!classId) return setClassSections([]);

        try {
            const response = await axios.get(route("common.get.school.class.sections", classId));
            const mappedSections = response.data.map(section => ({
                value: section.id,
                label: section.name,
            }));

            setClassSections(mappedSections);

            if (keepSection && data.class_section) {
                setData("class_section", data.class_section);
            }
        } catch (err) {
            console.error("Failed to load class sections:", err);
        }
    };


    useEffect(() => {
        if (schoolId) {
            fetchClasses();
        }
    }, [schoolId]);

    useEffect(() => {
        if (data.class && schoolClasses.length > 0) {
            handleClassChange(data.class, true);
        }
    }, [data.class, schoolClasses]);


    return (
        <>
            <div className="w-full mb-4">
                <InputLabel htmlFor="class" value="Class" />
                <SelectInput
                    id="class"
                    value={data.class}
                    onChange={(e) => handleClassChange(e.target.value)}
                    options={schoolClasses}
                    placeholder="Select Class"
                    className="mt-1 block w-full"
                />
                <InputError className="mt-2" message={errors.class} />
            </div>

            {displaySections ? (<>
                <div className="w-full mb-4">
                    <InputLabel htmlFor="class_section" value="Class Section" />
                    <SelectInput
                        id="class_section"
                        value={data.class_section}
                        onChange={(e) => setData("class_section", e.target.value)}
                        options={classSections}
                        placeholder="Select Class Section"
                        className="mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.class_section} />
                </div>
            </>) : ''}
        </>
    );
}
