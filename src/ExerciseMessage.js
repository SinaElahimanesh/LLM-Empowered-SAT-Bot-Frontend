export default function ExerciseMessage({ msg, img }) {
    // Format the message: Add new lines and convert **text** to <strong>text</strong>
    const formattedMsg = msg
        .replace(/(\d+\.)/g, '\n$1') // Add newline before numbers
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>bold</strong>

    return (
        <div className="flex justify-start">
            <div
                dir="rtl"
                className="max-w-xs bg-gray-200 text-blue-700 rounded-r-2xl rounded-tl-2xl"
            >
                <img className="w-full rounded-lg mb-3 shadow-sm" alt="exercise" src={img} />

                {/* Use dangerouslySetInnerHTML to render HTML correctly */}
                <p className="text-sm leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formattedMsg }} />
            </div>
        </div>
    );
}
