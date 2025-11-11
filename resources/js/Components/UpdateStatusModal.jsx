import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useEffect, useState } from "react";
import { useAlerts } from "./Alerts";
import { useHelpers } from "./Helpers";
import InputLabel from "./InputLabel";
import InputError from "./InputError";
import SelectInput from "./SelectInput";
import { useForm, router } from "@inertiajs/react";

export default function UpdateStatusModal({
    show,
    auth,
    selectedRows = [],
    onClose,
    onSuccess,
    submitRoute, // ✅ Dynamic route passed here
}) {
    const { errorAlert, errorsHandling } = useAlerts();
    const { getClassPrefix } = useHelpers();

    const {
        data,
        setData,
        post,
        reset,
        errors,
        processing,
    } = useForm({
        class_prefix: '',
        uuids: [],
    });

    const [classPrefixOptions, setClassPrefixOptions] = useState([]);

    useEffect(() => {
        if (show) {
            setData("uuids", selectedRows);
            fetchPrefixes();
        }
    }, [show]);

    const fetchPrefixes = async () => {
        const prefixes = await getClassPrefix(); // keep this fixed
        const formatted = prefixes.map(prefix => ({
            value: prefix?.id,
            label: prefix?.prefix,
        }));
        setClassPrefixOptions(formatted);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.class_prefix) {
            errorAlert("Please select a class prefix.");
            return;
        }

        if (!submitRoute) {
            errorAlert("Submit route is missing.");
            return;
        }

        post(route(submitRoute), {
            onSuccess: () => {
                onSuccess();
                reset();
            },
            onError: errorsHandling,
        });
    };

    return (
        <Modal show={show} maxWidth="md" topCloseButton={true} handleTopClose={handleClose}>
            <form onSubmit={handleSubmit} className="p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Change Class Prefix</h3>

                <div className="mb-4">
                    <InputLabel htmlFor="class_prefix" value="Class Prefix *" />
                    <SelectInput
                        id="class_prefix"
                        value={data.class_prefix}
                        onChange={(e) => setData("class_prefix", e.target.value)}
                        options={classPrefixOptions}
                        required
                    />
                    <InputError className="mt-2" message={errors.class_prefix} />
                </div>

                <div className="flex justify-end">
                    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ml-3" type="submit" disabled={processing}>
                        {processing ? "Updating..." : "Confirm"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
