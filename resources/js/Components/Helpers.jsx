import moment from 'moment';
import { useAlerts } from './Alerts';

export const useHelpers = () => {
    const { successAlert, errorAlert } = useAlerts();

    /**
     * Format a Standard Date
     *
     * @param {String} d Date String
     * @param {String} f Date Format String as per ISO
     * @return {String}
     */
    const dateFormat = (d, f = 'DD-MM-YYYY') => {
        if (d == null || !d.length) {
            return '--/--/----';
        }
        if (moment(d).isValid()) {
            return moment(d).format(f);
        }
        return 'nn/nn/nnnn';
    }

    const formatDateForInput = (datetimeString) => {
        if (!datetimeString) return '';

        const date = new Date(datetimeString);
        if (isNaN(date)) return '';

        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const toUpperCaseAll = (str) => {
        return str ? str.toUpperCase() : 'NA';
    };


    /**
     * Replace all hyphens (-) with dots (.)
     * @param {String} txt Input string
     * @returns {String}
     */
    const replaceDashWithDot = (txt) => {
        return txt.replace(/-/g, '.');
    };

    // const formatDateForInput = (dateStr) => {
    //     if (!dateStr) return "";
    //     return dateStr.split(" ")[0]; // returns "2026-03-31"
    // };


    //2026-04-01 23:59:59 - return this like: 1 April 2026
    const formatReadableDate = (dateStr) => {
        if (!dateStr) return '';

        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const formatReadableDateTime = (dateStr) => {
        if (!dateStr) return '';

        const date = new Date(dateStr);
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-GB', options);
    };


    /**
     *
     * @param {String} txt Text String to remove space & urlencode characters
     * @param {String} replaceWith Character which will take place
     * @returns {String}
     */
    const generateUrlSearchString = (txt, replaceWith = '-') => {
        return txt.replace(/[^a-zA-Z0-9\-]+/g, '-');
    }

    /**
     * Copy Any Text
     *
     * @param {String} c Content to cop
     * @param {String} m Message to show on alert
     * @returns void
     */
    const copyContent = (c, m = 'Copied.') => {
        try {
            navigator.clipboard.writeText(c);
            successAlert(m);
        } catch (error) {
            errorAlert(`Failed to copy: ${c}.`);
        }
    }


    /**
     * Make text bold where text is between two asterisks (*)
     *
     * @param {string} text - The text to format
     * @return {string} - Formatted text
     */
    const makeTextBoldWithStar = (text) => {
        return text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    }


    /**
     * Get substring of a text based on word positions
     *
     * @param {string} text - The full text
     * @param {number} startWord - Index of the starting word (0-based)
     * @param {number} endWord - Index of the ending word (exclusive)
     * @return {string} - Extracted substring
     */
    const getSubstringByWords = (text, startWord, endWord) => {
        if (!text) return "";

        const words = text.split(" "); // split by spaces
        const slicedWords = words.slice(startWord, endWord); // get specific words
        return slicedWords.join(" "); // join them back as string
    };


    /**
     * Get substring of a text based on character positions
     *
     * @param {string} text - The full text
     * @param {number} startChar - Index of the starting character (0-based)
     * @param {number} endChar - Index of the ending character (exclusive)
     * @return {string} - Extracted substring
     */
    const getSubstringByChars = (text, startChar, endChar) => {
        if (!text) return "";
        return text.substring(startChar, endChar);
    };


    /**
     * Display Value With Rupee Sign
     *
     * @param {number|string} num - Number
     * @return {string} - Formatted text
     */
    const displayInRupee = (num) => {
        if (num === null || num === undefined || num === '') return "₹0.00";

        // Convert to float
        const value = parseFloat(num);

        if (isNaN(value)) return "₹0.00";

        // Format with 2 decimals
        return `₹${value.toFixed(2)}`;
    };



    /**
     * Return Current Year Session Start Date - Session Always Start Form April Month
     * @return Session Start Date
     */
    const sessionStart = () => {
        const currentYear = new Date().getFullYear();
        return new Date(`${currentYear}-04-01`).toISOString().slice(0, 10);
    };

    /**
     * Return Current Year Session End Date - Session Always End In Next Year 31st March
     * @return Session Start Date
     */
    const sessionEnd = () => {
        const currentYear = new Date().getFullYear();
        return new Date(`${currentYear + 1}-03-31`).toISOString().slice(0, 10);
    };

    /**
     * Make text italic where text is between underscores (_)
     *
     * @param {string} text - The text to format
     * @return {string} - Formatted text
     */
    const makeTextItalicWithUnderscore = (text) => {
        return text.replace(/_(.*?)_/g, "<i>$1</i>");
    }


    /**
    * Convert a string to slug
    * @param {String} str
    * @returns {String}
    */
    const toSlug = (str) => {
        return str?.toLowerCase()?.replace(/\s+/g, "-");
    };


    /**
     * Make text monospace where text is between triple backticks (```)
     *
     * @param {string} text - The text to format
     * @return {string} - Formatted text
     */
    const makeTextMonospace = (text) => {
        return text.replace(/```(.*?)```/g, "<code>$1</code>");
    }

    /**
     * Make text strikethrough where text is between tildes (~~)
     *
     * @param {string} text - The text to format
     * @return {string} - Formatted text
     */
    const makeTextStrikethrough = (text) => {
        return text.replace(/~(.*?)~/g, "<del>$1</del>");
    };


    const capitalizeWords = (str) => {
        return str ? str.replace(/\b\w/g, char => char.toUpperCase()) : 'NA';
    };

    const toTitleCase = (str) => {
        return str
            ? str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            : '';
    };

    const allCapitalizeWords = (str) => {
        return str ? str.toUpperCase() : 'NA';
    };

    const toLowerCase = (str) => {
        return str ? str.toLowerCase() : 'na';
    };

    const toSentenceCase = (str) => {
        return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : 'NA';
    };


    const replaceUnderscoreWithSpace = (str) => {
        return str ? str.replace(/_/g, ' ') : '';
    };

    const replaceUnderscoreWithDot = (str) => {
        return str ? str.replace(/_/g, '.') : '';
    };

    const replaceDashcoreWithSpace = (str) => {
        return str ? str.replace(/-/g, ' ') : '';
    };



    // Function to check if a value matches the search query (including nested objects)
    const matchesSearchQuery = (value, searchLower) => {
        if (value && typeof value === "object") {
            return Object.values(value).some((nestedValue) =>
                matchesSearchQuery(nestedValue, searchLower)
            );
        }
        return String(value)
            .toLowerCase()
            .includes(searchLower);
    };

    // Function to filter a list of items based on a search query
    const filterListBySearchQuery = (list, searchQuery) => {
        const searchLower = searchQuery.toLowerCase();
        return list?.filter((item) => {
            return (
                matchesSearchQuery(item?.name, searchLower) ||
                matchesSearchQuery(item?.last_name, searchLower) ||
                matchesSearchQuery(item?.email, searchLower) ||
                matchesSearchQuery(item?.phone, searchLower) ||
                matchesSearchQuery(item?.whatsapp_phone, searchLower) ||
                matchesSearchQuery(item?.status, searchLower) ||

                (item.main_state && (
                    matchesSearchQuery(item?.main_state?.name, searchLower)
                )) ||

                (item.data && (
                    Object.keys(item.data).some((key) =>
                        matchesSearchQuery(item.data[key], searchLower)
                    )
                )) ||


                (item.user && (
                    matchesSearchQuery(item.user?.name, searchLower) ||
                    (item.user.main_state &&
                        matchesSearchQuery(item.user?.main_state?.name, searchLower)
                    )
                ))
            );
        });
    };


    /**
     * Get ClassPrefix JSON Array
     * @returns {Array}
     */
    const getClassPrefix = async () => {
        const resp = await axios.get(route('common.class.prefixes'));
        return resp.data || [];
    }

    /**
     * Get Default ClassPrefix JSON Array
     * @returns {Array}
     */
    const getDefaultClasses = async () => {
        const resp = await axios.get(route('common.get.default.classes'));
        return resp.data || [];
    }

    /**
     * Get Default Session JSON Array
     * @returns {Array}
     */
    const getDefaultSessions = async () => {
        const resp = await axios.get(route('common.get.default.sessions'));
        return resp.data || [];
    }

    /**
     * Get Classes With Section JSON Array
     * @returns {Array}
     */
    const getClassWithSection = async () => {
        const resp = await axios.get(route('common.get.school.class.with.sections'));
        return resp.data || [];
    }

    /**
     * Get Default Section JSON Array
     * @returns {Array}
     */
    const getDefaultSections = async () => {
        const resp = await axios.get(route('common.get.default.sections'));
        return resp.data || [];
    }


    /**
     * Format number into K/M/B notation
     * @param {number} num - The number to format
     * @param {number} digits - Decimal places (default: 1)
     * @returns {string}
     *
     * Examples:
     *  formatCount(258000) => "258K"
     *  formatCount(1250000) => "1.3M"
     *  formatCount(987) => "987"
     */
    const formatCount = (num, digits = 1) => {
        if (num === null || num === undefined || isNaN(num)) return '0';
        const units = [
            { value: 1E9, symbol: "B" }, // Billion
            { value: 1E6, symbol: "M" }, // Million
            { value: 1E3, symbol: "K" }  // Thousand
        ];

        for (let i = 0; i < units.length; i++) {
            if (num >= units[i].value) {
                return (num / units[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + units[i].symbol;
            }
        }
        return num.toString(); // For numbers < 1000
    };



    /**
     * Get Countries JSON Array
     * @param {String} search Search String for Country name
     * @returns {Array}
     */
    const getCountries = async (search = null) => {
        const resp = await axios.get(route('common.json.country', { search }));
        if (!resp.data?.success) {
            // console.log(`Error In Fetching Country:`, resp.data?.message || 'Server Error');
        }
        return resp.data?.countries || [];
    }

    /**
     * Get States By Country Id
     * @param {Number} country_id
     * @param {String} search Search String for State Name
     * @returns {Array}
     */
    const getStates = async (country_id, search = null) => {
        const resp = await axios.get(route('common.json.state', { country_id, search }));
        if (!resp.data?.success) {
            // console.log(`Error In Fetching States:`, resp.data?.message || 'Server Error');
        }
        return resp.data?.states || [];
    }

    /**
     * Get Cities By State Id
     * @param {Number} state_id
     * @param {String} search Search String for State Name
     * @returns {Array}
     */
    const getCities = async (state_id, search = null) => {
        const resp = await axios.get(route('common.json.city', { state_id, search }));
        if (!resp.data?.success) {
            // console.log(`Error In Fetching Cities:`, resp.data?.message || 'Server Error');
        }
        return resp.data?.cities || [];
    }

    /**
     * Resize & Reduce the size of an Image File
     *
     * @param {Blob} img Blob IMage
     * @param {Number} q Compress Quality 0 to 1
     * @param {Number} count Counter for recursive
     * @returns {Blob} Image Blob reduced in size
     */
    const compressImage = (img, q = 0.9, count = 1, maxWidth = 1280, maxHeight = 800) => {
        // console.log('reduce-counter', {q,count,size: img.size/1025});
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                const maxSize = 500 * 1024;
                reader.onload = (e) => {
                    const i = new Image();
                    i.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        let width = i.width;
                        let height = i.height;

                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }

                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                        canvas.width = i.width;
                        canvas.height = i.height;

                        ctx.drawImage(i, 0, 0, canvas.width, canvas.height);

                        canvas.toBlob(async (blob) => {
                            if (blob) {
                                if (blob.size <= maxSize) {
                                    resolve(blob);
                                } else {
                                    const ij = new File([blob], 'compressed.jpeg', { type: "image/jpeg" });
                                    const compressedBlob = await compressImage(ij, Math.max(0, q - 0.2), count + 1);
                                    resolve(compressedBlob);
                                }
                            } else {
                                reject(new Error('Failed to compress the image...'))
                            }
                        }, 'image/jpeg', q); // Adjust quality (0-1) as needed
                    }
                    i.src = e.target.result;
                }
                reader.readAsDataURL(img);

            } catch (_e) {
                reject(_e);
            }
        });
    }


    const hasPermissionLike = (permissions = [], prefix = '') => {
        return permissions.some(permission => permission.startsWith(prefix));
    }

    const hasPermission = (permissions = [], name = '') => {
        return permissions.includes(name);
    }

    const hasAnyPermission = (permissions = [], names = []) => {
        return names.some(name => permissions.includes(name));
    }

    const getClassNameByPrefixType = (classNumber, prefixType = "normal") => {
        if (!classNumber || isNaN(classNumber)) return classNumber;

        const num = parseInt(classNumber);

        const toRoman = (n) => {
            const romanMap = [
                ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
                ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
                ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
            ];
            let result = "";
            for (const [letter, value] of romanMap) {
                while (n >= value) {
                    result += letter;
                    n -= value;
                }
            }
            return result;
        };

        const toAlphabetWord = (n) => {
            const words = [
                "First", "Second", "Third", "Fourth", "Fifth",
                "Sixth", "Seventh", "Eighth", "Ninth", "Tenth",
                "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth",
                "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth",
                "Twenty-First", "Twenty-Second", "Twenty-Third", "Twenty-Fourth", "Twenty-Fifth",
                "Twenty-Sixth", "Twenty-Seventh", "Twenty-Eighth", "Twenty-Ninth", "Thirtieth"
            ];
            return words[n - 1] || `Class ${n}`;
        };

        const toAlphaNum = (n) => {
            const suffixes = ["th", "st", "nd", "rd"];
            const v = n % 100;
            const suffix = (v >= 11 && v <= 13) ? "th" : (suffixes[n % 10] || "th");
            return `${n}${suffix}`;
        };

        switch (prefixType.toLowerCase()) {
            case "roman":
                return toRoman(num);
            case "alphabet":
                return toAlphabetWord(num);
            case "alpha numeric":
                return toAlphaNum(num);
            case "normal":
            default:
                return String(num);
        }
    };



    const getTextReplacements = (order) => {
        return {
            // SCHOOL KEYS
            "{{school_name}}": order?.school?.name || "",
            "{{school_address}}": order?.school?.address || "",
            "{{school_prefix}}": order?.school?.prefix || "",
            "{{school_pincode}}": order?.school?.pincode || "",

            // STUDENT KEYS
            "{{uid_no}}": order?.student?.uid_no || "",
            "{{student_name}}": order?.student?.name || "",
            "{{student_email}}": order?.student?.email || "",
            "{{student_phone}}": order?.student?.phone || "",
            "{{student_whatsapp_phone}}": order?.student?.whatsapp_phone || "",
            "{{student_land_line_no}}": order?.student?.land_line_no || "",
            "{{student_dob}}": order?.student?.dob || "",
            "{{student_gender}}": order?.student?.gender || "",
            "{{student_blood_group}}": order?.student?.blood_group || "",
            "{{class_name}}": order?.student?.class?.name_withprefix || "",
            "{{section_name}}": order?.student?.section?.section_name || "",
            "{{house_name}}": order?.student?.house?.name || "",
            "{{transport_mode}}": order?.student?.transport_mode || "",
            "{{student_reg_no}}": order?.student?.reg_no || "",
            "{{student_roll_no}}": order?.student?.roll_no || "",
            "{{student_aadhar_no}}": order?.student?.aadhar_no || "",
            "{{student_admission_no}}": order?.student?.admission_no || "",
            "{{student_rfid_no}}": order?.student?.rfid_no || "",
            "{{student_address}}": order?.student?.address || "",
            "{{student_pincode}}": order?.student?.pincode || "",

            "{{father_name}}": order?.student?.parent?.father_name || "",
            "{{father_email}}": order?.student?.parent?.father_email || "",
            "{{father_phone}}": order?.student?.parent?.father_phone || "",
            "{{father_wphone}}": order?.student?.parent?.father_wphone || "",
            "{{mother_name}}": order?.student?.parent?.mother_name || "",
            "{{mother_email}}": order?.student?.parent?.mother_email || "",
            "{{mother_phone}}": order?.student?.parent?.mother_phone || "",
            "{{mother_wphone}}": order?.student?.parent?.mother_wphone || "",

            "{{gurdian_name}}": order?.student?.gurdian?.name || "",
            "{{gurdian_relation}}": order?.student?.gurdian?.relation || "",
            "{{gurdian_email}}": order?.student?.gurdian?.email || "",
            "{{gurdian_phone}}": order?.student?.gurdian?.phone || "",
            "{{gurdian_whatsapp_phone}}": order?.student?.gurdian?.whatsapp_phone || "",
        };
    }



    return {
        dateFormat,
        formatDateForInput,
        formatReadableDate,
        formatReadableDateTime,
        generateUrlSearchString,
        copyContent,
        makeTextBoldWithStar,
        makeTextItalicWithUnderscore,
        makeTextMonospace,
        toSlug,
        makeTextStrikethrough,
        capitalizeWords,
        allCapitalizeWords,
        replaceUnderscoreWithSpace,
        replaceUnderscoreWithDot,
        replaceDashcoreWithSpace,
        filterListBySearchQuery,
        compressImage,
        toSentenceCase,
        hasPermissionLike,
        hasPermission,
        hasAnyPermission,
        sessionStart,
        sessionEnd,
        getClassPrefix,
        getDefaultClasses,
        getClassWithSection,
        getDefaultSessions,
        getDefaultSections,
        getClassNameByPrefixType,
        toLowerCase,
        displayInRupee,
        getTextReplacements,
        getSubstringByWords,
        getSubstringByChars,
        formatCount,
        replaceDashWithDot,
        toUpperCaseAll,
        toTitleCase
    };

}
