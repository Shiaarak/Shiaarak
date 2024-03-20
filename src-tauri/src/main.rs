// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn update_size(w: i32, h: i32) -> Result<String, ()> {
    let json = serde_json::json!( {
        "width": w,
        "height": h
    });

    return Ok(json.to_string());
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![update_size])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
