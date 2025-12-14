const supabaseUrl = "https://qdquntklmaopcbkotjtd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcXVudGtsbWFvcGNia290anRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzExNTMsImV4cCI6MjA4MTMwNzE1M30.6Ehwy9tBSSY_3cD0yZ237hDKvG1PJwi248Mdy1oEV7I"; 

const client = supabase.createClient(supabaseUrl, supabaseKey);

// Guardar comentario
document.getElementById("comentario-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !mensaje) return;

    const { error } = await client
        .from("comentarios")
        .insert([{ nombre, mensaje }]);

    if (error) {
        console.error("Error al guardar:", error.message);
        return;
    }

    document.getElementById("comentario-form").reset();
    cargarComentarios();
});

// Mostrar comentarios
async function cargarComentarios() {
    const { data, error } = await client
        .from("comentarios")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error al cargar:", error.message);
        return;
    }

    const contenedor = document.getElementById("lista-comentarios");
    contenedor.innerHTML = "";

    data.forEach(c => {
        contenedor.innerHTML += `
            <div class="comentario">
                <strong>${c.nombre}</strong>
                <p>${c.mensaje}</p>
            </div>
        `;
    });
}

cargarComentarios();
