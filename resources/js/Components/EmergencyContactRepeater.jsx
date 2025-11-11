import { useState, useEffect } from "react";
import TextInput from "./TextInput";
import InputLabel from "./InputLabel";
import PrimaryButton from "./PrimaryButton";

export default function EmergencyContactRepeater({ handleChange }) {
    const [contacts, setContacts] = useState([{ relation: "", name: "", phone: "" }]);

    useEffect(() => {
        handleChange({
            target: { name: "emergency_contacts", value: contacts },
        });
    }, []);

    const handleContactChange = (index, key, value) => {
        const updatedContacts = [...contacts];
        updatedContacts[index][key] = value;
        setContacts(updatedContacts);
        handleChange({
            target: { name: "emergency_contacts", value: updatedContacts },
        });
    };

    const addContact = () => {
        const updated = [...contacts, { relation: "", name: "", phone: "" }];
        setContacts(updated);
        handleChange({
            target: { name: "emergency_contacts", value: updated },
        });
    };

    const removeContact = (index) => {
        if (contacts.length === 1) return;
        const updated = contacts.filter((_, i) => i !== index);
        setContacts(updated);
        handleChange({
            target: { name: "emergency_contacts", value: updated },
        });
    };

    return (
        <div className="space-y-6">
            {contacts.map((contact, index) => {
                const isRequired = index > 0;

                return (
                    <div
                        key={index}
                        className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-2 md:p-3 relative"
                    >
                        {/* Delete button */}
                        {contacts.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeContact(index)}
                                className="absolute top-3 right-3 text-sm text-red-600 hover:text-red-800"
                            >
                                ✕
                            </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {/* Relation */}
                            <div>
                                <InputLabel htmlFor={`relation_${index}`} value="Relation" />
                                <select
                                    id={`relation_${index}`}
                                    name={`emergency_contacts[${index}][relation]`}
                                    value={contact.relation}
                                    onChange={(e) =>
                                        handleContactChange(index, "relation", e.target.value)
                                    }
                                    required={isRequired}
                                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">- Select Relation -</option>
                                    <option value="Self">Self</option>
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Brother">Brother</option>
                                    <option value="Sister">Sister</option>
                                    <option value="Cousin">Cousin</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Name */}
                            <div>
                                <InputLabel htmlFor={`name_${index}`} value="Name" />
                                <TextInput
                                    id={`name_${index}`}
                                    type="text"
                                    name={`emergency_contacts[${index}][name]`}
                                    value={contact.name}
                                    onChange={(e) =>
                                        handleContactChange(index, "name", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="Enter full name"
                                    required={isRequired}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <InputLabel htmlFor={`phone_${index}`} value="Phone" />
                                <TextInput
                                    id={`phone_${index}`}
                                    type="text"
                                    name={`emergency_contacts[${index}][phone]`}
                                    value={contact.phone}
                                    onChange={(e) =>
                                        handleContactChange(
                                            index,
                                            "phone",
                                            e.target.value.replace(/[^0-9]/g, "")
                                        )
                                    }
                                    maxLength="10"
                                    className="mt-1 block w-full"
                                    placeholder="10-digit phone number"
                                    required={isRequired}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Add Contact Button */}
            <div className="flex justify-start">
                <PrimaryButton
                    type="button"
                    onClick={addContact}
                >
                    + Add Emergency Contact
                </PrimaryButton>
            </div>
        </div>
    );
}
