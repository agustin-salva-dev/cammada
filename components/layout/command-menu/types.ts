import type * as React from "react";

export type CommandScopeId = "all" | "admin" | "web" | "settings" | "actions";

export type CommandScopeTab = {
  id: CommandScopeId;
  label: string;
  icon: React.ElementType;
};

export type CommandItemConfig = {
  label: string;
  icon: React.ElementType;
  route?: string;
  onSelect?: () => void;
  permission?: string;
  shortcut?: string;
  keywords: string;
};

export type CommandSubgroupConfig = {
  id: string;
  heading: string;
  items: CommandItemConfig[];
};

export type CommandSectionConfig = {
  scope: CommandScopeId;
  subgroups: CommandSubgroupConfig[];
};

export type CommandActionItem = {
  label: string;
  icon: React.ElementType;
  actionKey: "luchador" | "equipo" | "combate" | "evento";
  permission: string;
  shortcut: string;
  keywords: string;
};
