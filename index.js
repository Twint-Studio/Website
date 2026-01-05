import { cp, rm } from "fs/promises";

const src = `${__dirname}/src`;
const dist = `${__dirname}/dist`;

const output = `${dist}/index.html`;

import services from "./data.json" with { type: "json" };

try {
    await rm(dist, { recursive: true, force: true });
    await cp(src, dist, { recursive: true });

    const template = await Bun.file(`${src}/index.html`).text();
    const html = services.map(({ title, description, link }) => {
        const links = (Array.isArray(link) ? link : [link]).filter(Boolean);
        const multiple = links.length > 1;

        const buttons = links
            .map((url, i) => {
                const label = multiple ? `Open Service ${i + 1}` : "Open Service";
                return /* html */ `<a href="${url}"><button>${label} <i>link</i></button></a>`;
            })
            .join("");

        return /* html */ `
            <article class="round s12 m6 l4">
                <div class="row">
                    <div class="max">
                        <h5>${title}</h5>
                        <p>${description}</p>
                    </div>
                </div>
                ${buttons ? `<nav>${buttons}</nav>` : ""}
            </article>
        `;
    }).join("");

    await Bun.write(output, template.replace("{{ services }}", html));

    console.info("✅");
} catch (err) {
    console.error("❌");
}