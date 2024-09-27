import { readdir, readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

interface LanguagesModule {
	/** 'ChineseSimplified'  : 'ChineseSimplified' */
	LanguagesEnum: {
		[PascalCaseLanguage: string]: string;
	};
	/** 'CHS': 'ChineseSimplified' */
	languageMap: {
		[abbreviation: string]: string;
	};
	/** 'ChineseSimplified':  'zh-cn' */
	localeMap: {
		[PascalCaseLanguage: string]: string;
	};
	/** 'ChineseSimplified' */
	languages: string[];
	/** 'CHS' */
	languageCodes: string[];
}

const CLONE_DIR = resolve("", "genshin-db-clone");
const OUT_DIR = resolve("", "out");

if (!existsSync(CLONE_DIR)) {
	throw new Error("genshindb not found");
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR);

const getLanguages = async () => {
	const { languages } = (await import(
		`${CLONE_DIR}/src/language.js`
	)) as LanguagesModule;
	return languages;
};

const getIndex = async (language: string, data: string) => {
	const file = await readFile(
		join(CLONE_DIR, "src/data/index", language, `${data}.json`),
		"utf-8"
	);
	const json = JSON.parse(file);
	return json;
};

const data = await getIndex("English", "achievements");

await writeFile(
	join(OUT_DIR, "achievements.json"),
	JSON.stringify(data, null, 2)
);
