import { cp, rm } from "fs/promises";

const src = `${__dirname}/src`;
const dist = `${__dirname}/dist`;

const output = `${dist}/index.html`;

import services from "./data.json";

try {
    await rm(dist, { recursive: true, force: true });
    await cp(src, dist, { recursive: true });

    const template = await Bun.file(`${src}/index.html`).text();
    const html = services
        .map((item) => `
            <article class="round s12 m6 l4">
                <div class="row">
                    <div class="max">
                        <h5>${item.title}</h5>
                        <p>${item.description}</p>
                    </div>
                </div>
                <nav>
                    <a href="${item.link}">
                        <button>Open Service <i>link</i></button>
                    </a>
                </nav>
            </article>
        `).join("");

    await Bun.write(output, template.replace("{{ services }}", html));

    console.info("✅");
} catch (err) {
    console.error("❌");
}