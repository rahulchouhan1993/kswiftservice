import '@/CustomCss/tiptap.css';
import Link from "@tiptap/extension-link";
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAlerts } from "./Alerts";
import Tooltip from './Tooltip';
import { initTooltips } from 'flowbite';
import moment from 'moment';
import { Table } from '@tiptap/extension-table';
import { IoAddCircle, IoCloseCircle } from 'react-icons/io5';
import '../../css/app.css';
import { FaBold, FaFileImage, FaItalic, FaLink, FaParagraph, FaTable } from 'react-icons/fa6';
import { BsTypeH1, BsTypeH2, BsTypeH3 } from 'react-icons/bs';
import { BiUnlink } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';

import Image from "@tiptap/extension-image";


export default function TipTapTextEditor({ 
    content = '',
    handleContentUpdate = (c) => { 
        // console.log('e-content', c)
    } ,
    showTable = false,
    showImage = false,
}) {
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);
    const editorId = moment().toISOString();
    const {errorAlert} = useAlerts();
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [tableHeadRow, setTableHeadRow] = useState(true);
    const [tablePopup, setTableTopup] = useState(false);
    const [editorContent, setEditorContent] = useState(content);
    const extensions = [
        StarterKit,
        Link.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
            protocols: ['https'],
            isAllowedUri: (url, ctx) => {
                try {
                    // construct URL
                    const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                    // use default validation
                    if (!ctx.defaultValidate(parsedUrl.href)) {
                        return false
                    }

                    // disallowed protocols
                    const disallowedProtocols = ['ftp', 'file', 'mailto']
                    const protocol = parsedUrl.protocol.replace(':', '')

                    if (disallowedProtocols.includes(protocol)) {
                        return false
                    }

                    // only allow protocols specified in ctx.protocols
                    const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                    if (!allowedProtocols.includes(protocol)) {
                        return false
                    }

                    // disallowed domains
                    const disallowedDomains = []
                    const domain = parsedUrl.hostname

                    if (disallowedDomains.includes(domain)) {
                        return false
                    }

                    // all checks have passed
                    return true
                } catch (error) {
                    return false
                }
            },
            shouldAutoLink: url => {
                try {
                    // construct URL
                    const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                    // only auto-link if the domain is not in the disallowed list
                    const disallowedDomains = []
                    const domain = parsedUrl.hostname

                    return !disallowedDomains.includes(domain)
                } catch (error) {
                    return false
                }
            },
        }),
        Table.configure({

        }),
        TableRow,
        TableHeader,
        TableCell,

        // for image insertion 
        Image.configure({
        inline: false,
        allowBase64: true,
    }), 
    ];

    const editor = useEditor({
        extensions,
        content: content || "",
        editorProps: {
            attributes: {
                class: "px-2 py-2 bg-white rounded-b-lg border border-gray-200 dark:border-gray-600 !focus:ring-0 !focus:border !focus:border-gray-200 !dark:focus:border !dark:focus:border-gray-600 !dark:focus:ring-0 min-h-[60px]",
            },
        },
        onUpdate({ editor }) {
            // handleContentUpdate(editor.getHTML());
            if(timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                handleContentUpdate(editor.getHTML());
            }, 2000)
        },
    });

    const setHyperLink = useCallback(() => {
        if (editor) {
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)

            // cancelled
            if (url === null) {
                return
            }

            // empty
            if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink()
                    .run()

                return
            }

            // update link
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    }, [editor])

    const createTable = (e) => {
        const notValid = ['', null, 0];
        if(notValid.includes(tableRows)) {
            errorAlert('Number of Rows should minimum 1!');
            return;
        }

        if(notValid.includes(tableCols)) {
            errorAlert('Number of Columns should minimum 1!');
            return;
        }
        if(editor) {
            editor.chain().focus().insertTable({cols:tableCols, rows:tableRows, withHeaderRow:true}).run();
        }
        setTableTopup(false);
    }

    useEffect(() => {
        if (editor && content !== undefined) {
            editor.commands.setContent(content || ""); 
            setEditorContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if(editor){
            editor.commands.clearContent();
            editor.commands.setContent(editorContent);
        }
    }, []);

    useEffect(() => {
        initTooltips();
    },[])

    return (
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-white dark:bg-[#0a0e37] dark:border-gray-600 h-full">
            <div className="flex items-center justify-between px-1 py-0 border-b dark:border-gray-600 ">
                <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600 relative ">
                    <div className="py-1 flex items-center space-x-1 rtl:space-x-reverse sm:pe-4 ">
                        {/* for bold */}
                        <button
                            type="button"
                            className={
                                "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 " +
                                (editor?.isActive("bold")
                                    ? "!text-white bg-gray-900"
                                    : "")
                            }
                            onClick={() =>
                                editor?.chain().focus().toggleBold().run()
                            }
                            disabled={
                                !editor
                                    ?.can()
                                    .chain()
                                    .focus()
                                    .toggleBold()
                                    .run()
                            }
                        >
                            <FaBold />
                            <span className="sr-only">Bold</span>
                        </button>

                        {/* for Ittalic button */}
                        <button
                            type="button"
                            className={
                                "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 " +
                                (editor?.isActive("italic")
                                    ? "!text-white bg-gray-900"
                                    : "")
                            }
                            onClick={() =>
                                editor?.chain().focus().toggleItalic().run()
                            }
                            disabled={
                                !editor
                                    ?.can()
                                    .chain()
                                    .focus()
                                    .toggleItalic()
                                    .run()
                            }
                        >
                            <FaItalic />
                            <span className="sr-only">Italic</span>
                        </button>

                        {/* for h1 btn */}
                        <button
                            type="button"
                            className={
                                "p-1 text-gray-900 rounded cursor-pointer  hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 " +
                                (editor?.isActive("heading", {
                                    level: 1,
                                })
                                    ? "!text-white bg-gray-900"
                                    : "")
                            }
                            onClick={() =>
                                editor
                                    ?.chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run()
                            }
                        >
                            <BsTypeH1 />
                            <span className="sr-only">H1</span>
                        </button>

                        {/* for h2 btn */}
                        <button
                            type="button"
                            className={
                                "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 " +
                                (editor?.isActive("heading", {
                                    level: 2,
                                })
                                    ? "!text-white bg-gray-900"
                                    : "")
                            }
                            onClick={() =>
                                editor
                                    ?.chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run()
                            }
                        >
                            {" "}
                            <BsTypeH2 />
                            <span className="sr-only">H2</span>
                        </button>

                        {/* for h3 btn */}
                        <button
                            type="button"
                            className={
                                "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 " +
                                (editor?.isActive("heading", {
                                    level: 3,
                                })
                                    ? "!text-white bg-gray-900"
                                    : "")
                            }
                            onClick={() =>
                                editor
                                    ?.chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run()
                            }
                        >
                            <BsTypeH3 />
                            <span className="sr-only">H3</span>
                        </button>

                        {/* For paragraph btn */}
                        <button
                            type="button"
                            className={
                                "px-1 text-gray-100 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 " +
                                (editor?.isActive("paragraph")
                                    ? "text-white bg-gray-900"
                                    : "")
                            }
                            onClick={() =>
                                editor?.chain().focus().setParagraph().run()
                            }
                        >
                            <span className="w-4 h-3 px-1 ">P</span>
                            <span className="sr-only">Paragraph</span>
                        </button>

                        {/* for link insert btn */}
                        <button
                            type="button"
                            className={
                                "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 " +
                                (editor?.isActive("link")
                                    ? "!text-white bg-gray-900"
                                    : "")
                            }
                            onClick={setHyperLink}
                            data-tooltip-target={`editor-insert-link-${editorId}`}
                        >
                            <FaLink />
                            <span className="sr-only">Link</span>
                        </button>
                        <Tooltip
                            targetEl={`editor-insert-link-${editorId}`}
                            title={"Inert Link"}
                        />

                        {/* for unlink insert btn */}
                        <button
                            type="button"
                            className={
                                "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 " +
                                (editor?.isActive("link")
                                    ? "!text-white bg-gray-900 block"
                                    : "hidden")
                            }
                            onClick={() =>
                                editor.chain().focus().unsetLink().run()
                            }
                            data-tooltip-target={`editor-delete-link-${editorId}`}
                        >
                            {" "}
                            <BiUnlink />
                            <span className="sr-only">UnLink</span>
                        </button>
                        <Tooltip
                            targetEl={`editor-delete-link-${editorId}`}
                            title={"Remove Link"}
                        />

                        <button
                            type="button"
                            className={
                                "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 hidden" +
                                (editor?.isActive("bulletList")
                                    ? "text-white bg-gray-900"
                                    : "")
                            }
                            onClick={() =>
                                editor?.chain().focus().toggleBulletList().run()
                            }
                            disabled={
                                !editor
                                    ?.can()
                                    .chain()
                                    .focus()
                                    .toggleBulletList()
                                    .run()
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="size-4"
                                color={"currentColor"}
                                fill={"none"}
                            >
                                <path
                                    d="M8 5L20 5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M4 5H4.00898"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4 12H4.00898"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4 19H4.00898"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 12L20 12"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M8 19L20 19"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="sr-only">Bullet List</span>
                        </button>

                        {showTable ? (<>
                            {/* for table btn  */}
                            <button
                                type="button"
                                className={
                                    "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 " +
                                    (tablePopup ? "text-white bg-gray-900" : "")
                                }
                                onClick={() => setTableTopup(!tablePopup)}
                                data-tooltip-target={`editor-create-table-${editorId}`}
                            >
                                {" "}
                                <FaTable />
                                <span className="sr-only">Table</span>
                            </button>
                            <Tooltip
                                targetEl={`editor-create-table-${editorId}`}
                                title={"Insert Table"}
                            />

                            {/* for delete table btn */}
                            <button
                                type="button"
                                className={
                                    "p-1 text-gray-900 rounded cursor-pointer hover:text-white hover:bg-red-600 dark:text-gray-100 dark:hover:text-white dark:hover:bg-red-600 " +
                                    (!editor
                                        .can()
                                        .chain()
                                        .focus()
                                        .deleteTable()
                                        .run()
                                        ? "hidden"
                                        : "")
                                }
                                onClick={() => {
                                    editor.chain().focus().deleteTable().run();
                                }}
                                data-tooltip-target={`editor-delete-table-${editorId}`}
                            >
                                <MdDelete />
                                <span className="sr-only">Delete Table</span>
                            </button>
                            <Tooltip
                                targetEl={`editor-delete-table-${editorId}`}
                                title={"Delete Table"}
                            />
                        </>) : ''}


                        {showImage ? (<>
                            {/* image insert btn  */}
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                editor
                                                    ?.chain()
                                                    .focus()
                                                    .setImage({
                                                        src: reader.result,
                                                        alt: file.name,
                                                    })
                                                    .run();
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1 text-gray-900 rounded cursor-pointer hover:bg-gray-900 hover:text-white dark:text-gray-100 dark:hover:bg-white/10"
                                >
                                    <FaFileImage />
                                    <span className="sr-only">Upload Image</span>
                                </button>
                            </div>
                        </>) : ''}
                    </div>

                    {/* for table inpert popup  */}
                    <div
                        className={
                            "absolute top-[-40px] z-[9999999] left-[10%] bg-gray-200 dark:bg-[#131836] rounded-t-lg border-t !border-tk dark:!border-tk w-[250px] min-h-10 grid grid-cols-3 gap-x-1 px-1 " +
                            (tablePopup ? "" : "hidden")
                        }
                    >
                        <div className="flex items-center justify-start gap-x-1">
                            <span className="text-xs text-black dark:text-gray-200">
                                Cols:
                            </span>
                            <input
                                type="number"
                                className="border-gray-400 focus:border-gray-500 focus:ring-0 rounded-md shadow-sm text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-1 py-1 text-xs w-12 text-center"
                                value={tableCols}
                                onChange={(e) => setTableCols(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-start gap-x-1">
                            <span className="text-xs text-black dark:text-gray-200">
                                Rows:
                            </span>
                            <input
                                type="number"
                                className="border-gray-400 focus:border-gray-500 focus:ring-0 rounded-md shadow-sm text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-1 py-1 text-xs w-12 text-center"
                                value={tableRows}
                                onChange={(e) => setTableRows(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-end gap-x-1">
                            <button
                                className=" rounded-full bg-tk dark:bg-tk dark:text-white text-gray-700  flex items-center justify-center text-2xl font-bold"
                                onClick={createTable}
                                type="button"
                            >
                                <IoAddCircle />
                            </button>
                            <button
                                className=" rounded-full text-2xl bg-white flex items-center justify-center text-red-800 font-bold"
                                onClick={() => {
                                    setTableTopup(false);
                                }}
                                type="button"
                            >
                                <IoCloseCircle />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <EditorContent
                editor={editor}
                className="prose  bg-white text-black dark:bg-[#0a0e37] dark:text-white rounded-lg "
            />
        </div>
    );
}
