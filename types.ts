import * as z from "zod";

export const AutoecoleSchema = z.enum(["Akka","Zguid","Tata"])
export type AutoecoleType = z.infer<typeof AutoecoleSchema>
export const AdresseSchema = z.enum(["Tata", "Issafen", "Tagmout", "Tigzmirte", "Adiss", "Tissint", "Foum zguid", "Akka", "Fam el hisn", "Tamanarte"])
export const CategorieSchema = z.enum(["A","B","C","D","E"])

export const TranchesSchema = z.object({
  _id: z.string().optional(),
  candidatId: z.string({ required_error: "aucun candidat seléctionné." }),
  montant: z
    .number()
    .positive({ message: "Merci d'entrer un montant plus que zéro." }),
  date:z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) {
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;
      }
      return arg;
    },
    z.date({ required_error: "La date est requise" })
  ),

})
export const CandidatSchema = z.object({
  _id: z.string().optional(),
  auto: AutoecoleSchema.refine(
    (val) => AutoecoleSchema.options.includes(val),
    { message: "Veuillez saisir une auto ecole valide." }),
  nom: z
    .string()
    .min(6, { message: "Le nom doit contenir au moins 6 charactères." }),
  cin: z
    .string()
    .min(3, { message: "Merci de renseigner le numèro de la cin. " }),
adresse: AdresseSchema.refine(
    (val) => AdresseSchema.options.includes(val),
    { message: "Veuillez saisir une adresse valide." }),
  
    tel: z
    .string()
    .optional(),
  categorie: CategorieSchema.refine(
    (val) => CategorieSchema.options.includes(val),
    { message: "Veuillez saisir une catégorie valide." }),
  
  prix: z
  
    .number({ message: "Merci de renseigner le prix de la préstation." }).default(0),
    paiements:z.array(TranchesSchema).optional(),
    totalPaye:z.number().optional()
});

export type CandidatType = z.infer<typeof CandidatSchema>;



export type TrancheType = z.infer<typeof TranchesSchema>;

export const VehiculeSchema = z.object({
  id: z.string().optional(),
  immat: z
    .string()
    .min(4, {
      message: "Merci de rensigner le numèro d'immatriculation du véhicule.",
    }),
  dateVisite: z.date({ message: "Merci de renseigner la date de la visite." }),
  dateAssurance: z.date({
    message: "Merci de renseigner la date d'assurance.",
  }),
  auto: z.string({
    required_error: "Chaque véhicule doit être affecté à une auto école.",
  }),
});

export type VehiculeType = z.infer<typeof VehiculeSchema>;

export const ChargeSchema = z
  .object({
    id: z.string().optional(),
    libelle: z
      .string()
      .min(4, { message: "Merci de rensigner le libellé de la charge." }),
    montant: z
      .number()
      .positive({ message: "Merci d'entrer un montant plus que zéro." }),
    nature: z
      .string()
      .min(4, { message: "Merci de rensigner la nature de la charge." }),
    recurente: z.boolean().default(false),
    date: z.date().default(new Date()),
    dateEchence: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recurente) {
      if (!data.dateEchence) {
        ctx.addIssue({
          code: "custom",
          path: ["dateEcheance"],
          message: "Merci de rensigner la date de l'écheance récurrente.",
        });
      }
    }
  });

export type ChargeType = z.infer<typeof ChargeSchema>;

export const PersonnelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(4, { message: "Merci de renseigner le nom." }),
  auto: z.string().min(1, { message: "Merci d'affecter à une auto école." }),
  salaire: z
    .number()
    .positive({ message: "Le salaire doit être plus que zéro." }),
});

export type PersonnelType = z.infer<typeof PersonnelSchema>;

export const AdminSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Merci de renseigner le nom d'utilisateur." }),
  password: z.string().min(8, { message: "Le mot de pass doit contenir 8 charactères min." }),
});

export type AdminType = z.infer<typeof AdminSchema>;

export const NewAdminSchema = AdminSchema.extend({
  confirmPassword: z
    .string()
    .min(8, { message: "Les mots de pass ne correspondent pas." }),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Les mots de pass ne correspondent pas.",
    });
  }
});
export type NewAdminType = z.infer<typeof NewAdminSchema>;

export type ActionResponseType<T> = {
  status: "success" | "failure";
  message?: string;
  data?: T;
};
