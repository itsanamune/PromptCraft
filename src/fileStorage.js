let fileHandle = null;

export async function saveData(data) {
  try {
    if (!fileHandle) {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: 'promptcraft-data.json',
        types: [{
          description: 'JSON File',
          accept: { 'application/json': ['.json'] },
        }],
      });
    }
    
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data));
    await writable.close();
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export async function loadData() {
  try {
    [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'JSON File',
        accept: { 'application/json': ['.json'] },
      }],
    });
    
    const file = await fileHandle.getFile();
    const contents = await file.text();
    return JSON.parse(contents);
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
}