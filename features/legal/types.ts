export interface LegalClause {
  text: string;
  items?: string[];
}

export interface LegalSectionData {
  id: string;
  title: string;
  clauses: LegalClause[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  version: string;
  sections: LegalSectionData[];
}
