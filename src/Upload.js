export function Upload() {
    return (
        <div className="Upload">
            <header className="Upload button">
                <p>Testing text</p>
                <input id="fileinput" type="file" accept=".ics" multiple></input>
            </header>
        </div>
    );
}