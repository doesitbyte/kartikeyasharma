"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataType = {
  personal_information: {
    name: string;
    tagline: string;
    email: string;
    linkedin: string;
    orcid: string;
  };
  skills_and_expertise: string[];
  experiences: Array<{
    position: string;
    duration: string;
    organization: string;
    institution: string;
    image: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    duration: string;
    image: string;
  }>;
  achievements: Array<{
    title: string;
    date: string;
    description: string;
    image: string;
  }>;
  publications_and_presentations: Array<{
    type: string;
    title: string;
    publisher?: string;
    organization?: string;
    year: number;
    image: string;
  }>;
  hobbies_interests_and_extracurricular: {
    student_athlete: Array<{
      achievement: string;
      year: string | number;
      image: string;
    }>;
    sports_coach: Array<{
      role: string;
      year: string | number;
      image: string;
    }>;
    others: Array<{
      title: string;
      image: string;
    }>;
  };
  ui_content: Record<string, any>;
};

type Section = 
  | "personal_information"
  | "skills_and_expertise"
  | "experiences"
  | "education"
  | "achievements"
  | "publications_and_presentations"
  | "hobbies_interests_and_extracurricular"
  | "ui_content";

export default function AdminPage() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("personal_information");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/data");
      if (!response.ok) throw new Error("Failed to load data");
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    // Verify password with API
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({}), // Empty body just for auth check
      });
      
      if (response.ok) {
        setAuthenticated(true);
        setError(null);
        // Store password in sessionStorage for subsequent requests
        sessionStorage.setItem("admin_password", password);
        setPassword(""); // Clear password from state
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Failed to authenticate");
    }
  };

  const handleSave = async () => {
    if (!data) return;
    
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Get password from sessionStorage (set during login)
      const storedPassword = sessionStorage.getItem("admin_password");
      if (!storedPassword) {
        setError("Not authenticated. Please login again.");
        setAuthenticated(false);
        return;
      }

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedPassword}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  const updateNestedValue = (path: string[], value: any) => {
    if (!data) return;
    
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (Array.isArray(current[path[i]])) {
        current = current[path[i]];
        continue;
      }
      current[path[i]] = { ...current[path[i]] };
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setData(newData);
  };

  const updateArrayItem = (path: string[], index: number, field: string, value: any) => {
    if (!data) return;
    
    const newData = { ...data };
    let current: any = newData;
    
    for (const key of path) {
      current = current[key];
    }
    
    const newArray = [...current];
    newArray[index] = { ...newArray[index], [field]: value };
    
    let parent: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent[path[i]];
    }
    parent[path[path.length - 1]] = newArray;
    
    setData(newData);
  };

  const addArrayItem = (path: string[], newItem: any) => {
    if (!data) return;
    
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = [...current[path[path.length - 1]], newItem];
    setData(newData);
  };

  const removeArrayItem = (path: string[], index: number) => {
    if (!data) return;
    
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = current[path[path.length - 1]].filter(
      (_: any, i: number) => i !== index
    );
    setData(newData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-4">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-destructive">Failed to load data</div>
      </div>
    );
  }

  const sections: { key: Section; label: string }[] = [
    { key: "personal_information", label: "Personal Information" },
    { key: "skills_and_expertise", label: "Skills & Expertise" },
    { key: "experiences", label: "Experiences" },
    { key: "education", label: "Education" },
    { key: "achievements", label: "Achievements" },
    { key: "publications_and_presentations", label: "Publications & Presentations" },
    { key: "hobbies_interests_and_extracurricular", label: "Extracurricular" },
    { key: "ui_content", label: "UI Content" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                sessionStorage.removeItem("admin_password");
                setAuthenticated(false);
              }}
              variant="outline"
            >
              Logout
            </Button>
            <Button onClick={loadData} variant="outline">
              Reload
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-md text-green-600 dark:text-green-400">
            Data saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-8">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    activeSection === section.key
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg p-6">
              {activeSection === "personal_information" && (
                <PersonalInformationEditor
                  data={data.personal_information}
                  onChange={(field, value) =>
                    updateNestedValue(["personal_information", field], value)
                  }
                />
              )}

              {activeSection === "skills_and_expertise" && (
                <ArrayEditor
                  items={data.skills_and_expertise}
                  label="Skill"
                  onChange={(items) =>
                    updateNestedValue(["skills_and_expertise"], items)
                  }
                />
              )}

              {activeSection === "experiences" && (
                <ExperiencesEditor
                  experiences={data.experiences}
                  onChange={(experiences) =>
                    updateNestedValue(["experiences"], experiences)
                  }
                />
              )}

              {activeSection === "education" && (
                <EducationEditor
                  education={data.education}
                  onChange={(education) =>
                    updateNestedValue(["education"], education)
                  }
                />
              )}

              {activeSection === "achievements" && (
                <AchievementsEditor
                  achievements={data.achievements}
                  onChange={(achievements) =>
                    updateNestedValue(["achievements"], achievements)
                  }
                />
              )}

              {activeSection === "publications_and_presentations" && (
                <PublicationsEditor
                  publications={data.publications_and_presentations}
                  onChange={(publications) =>
                    updateNestedValue(["publications_and_presentations"], publications)
                  }
                />
              )}

              {activeSection === "hobbies_interests_and_extracurricular" && (
                <ExtracurricularEditor
                  extracurricular={data.hobbies_interests_and_extracurricular}
                  onChange={(extracurricular) =>
                    updateNestedValue(["hobbies_interests_and_extracurricular"], extracurricular)
                  }
                />
              )}

              {activeSection === "ui_content" && (
                <UIContentEditor
                  uiContent={data.ui_content}
                  onChange={(uiContent) =>
                    updateNestedValue(["ui_content"], uiContent)
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for Personal Information
function PersonalInformationEditor({
  data,
  onChange,
}: {
  data: DataType["personal_information"];
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {key.replace(/_/g, " ")}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(key, e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ))}
    </div>
  );
}

// Component for Simple Array Editor (Skills)
function ArrayEditor({
  items,
  label,
  onChange,
}: {
  items: string[];
  label: string;
  onChange: (items: string[]) => void;
}) {
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{label}</h2>
        <Button onClick={addItem} size="sm">
          Add {label}
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={() => removeItem(index)}
            variant="destructive"
            size="sm"
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

// Component for Experiences Editor
function ExperiencesEditor({
  experiences,
  onChange,
}: {
  experiences: DataType["experiences"];
  onChange: (experiences: DataType["experiences"]) => void;
}) {
  const updateExperience = (index: number, field: string, value: any) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    onChange(newExperiences);
  };

  const updateResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].responsibilities = [
      ...newExperiences[expIndex].responsibilities,
    ];
    newExperiences[expIndex].responsibilities[respIndex] = value;
    onChange(newExperiences);
  };

  const addResponsibility = (expIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].responsibilities.push("");
    onChange(newExperiences);
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].responsibilities = newExperiences[
      expIndex
    ].responsibilities.filter((_, i) => i !== respIndex);
    onChange(newExperiences);
  };

  const addExperience = () => {
    onChange([
      ...experiences,
      {
        position: "",
        duration: "",
        organization: "",
        institution: "",
        image: "",
        responsibilities: [],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Experiences</h2>
        <Button onClick={addExperience} size="sm">
          Add Experience
        </Button>
      </div>
      {experiences.map((exp, expIndex) => (
        <div
          key={expIndex}
          className="border border-border rounded-lg p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Experience {expIndex + 1}</h3>
            <Button
              onClick={() => removeExperience(expIndex)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(exp)
              .filter(([key]) => key !== "responsibilities")
              .map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      updateExperience(expIndex, key, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Responsibilities</label>
              <Button
                onClick={() => addResponsibility(expIndex)}
                size="sm"
                variant="outline"
              >
                Add Responsibility
              </Button>
            </div>
            {exp.responsibilities.map((resp, respIndex) => (
              <div key={respIndex} className="flex gap-2 mb-2">
                <textarea
                  value={resp}
                  onChange={(e) =>
                    updateResponsibility(expIndex, respIndex, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px]"
                />
                <Button
                  onClick={() => removeResponsibility(expIndex, respIndex)}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Component for Education Editor
function EducationEditor({
  education,
  onChange,
}: {
  education: DataType["education"];
  onChange: (education: DataType["education"]) => void;
}) {
  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange(newEducation);
  };

  const addEducation = () => {
    onChange([
      ...education,
      {
        degree: "",
        institution: "",
        duration: "",
        image: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Education</h2>
        <Button onClick={addEducation} size="sm">
          Add Education
        </Button>
      </div>
      {education.map((edu, index) => (
        <div
          key={index}
          className="border border-border rounded-lg p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Education {index + 1}</h3>
            <Button
              onClick={() => removeEducation(index)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(edu).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateEducation(index, key, e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Component for Achievements Editor
function AchievementsEditor({
  achievements,
  onChange,
}: {
  achievements: DataType["achievements"];
  onChange: (achievements: DataType["achievements"]) => void;
}) {
  const updateAchievement = (index: number, field: string, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    onChange(newAchievements);
  };

  const addAchievement = () => {
    onChange([
      ...achievements,
      {
        title: "",
        date: "",
        description: "",
        image: "",
      },
    ]);
  };

  const removeAchievement = (index: number) => {
    onChange(achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <Button onClick={addAchievement} size="sm">
          Add Achievement
        </Button>
      </div>
      {achievements.map((achievement, index) => (
        <div
          key={index}
          className="border border-border rounded-lg p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Achievement {index + 1}</h3>
            <Button
              onClick={() => removeAchievement(index)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
          <div className="space-y-4">
            {Object.entries(achievement).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                {key === "description" ? (
                  <textarea
                    value={value}
                    onChange={(e) =>
                      updateAchievement(index, key, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      updateAchievement(index, key, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Component for Publications Editor
function PublicationsEditor({
  publications,
  onChange,
}: {
  publications: DataType["publications_and_presentations"];
  onChange: (publications: DataType["publications_and_presentations"]) => void;
}) {
  const updatePublication = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newPublications = [...publications];
    newPublications[index] = { ...newPublications[index], [field]: value };
    onChange(newPublications);
  };

  const addPublication = () => {
    onChange([
      ...publications,
      {
        type: "publication",
        title: "",
        publisher: "",
        year: new Date().getFullYear(),
        image: "",
      },
    ]);
  };

  const removePublication = (index: number) => {
    onChange(publications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Publications & Presentations</h2>
        <Button onClick={addPublication} size="sm">
          Add Publication/Talk
        </Button>
      </div>
      {publications.map((pub, index) => (
        <div
          key={index}
          className="border border-border rounded-lg p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {pub.type === "publication" ? "Publication" : "Invited Talk"}{" "}
              {index + 1}
            </h3>
            <Button
              onClick={() => removePublication(index)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={pub.type}
                onChange={(e) =>
                  updatePublication(index, "type", e.target.value)
                }
                className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="publication">Publication</option>
                <option value="invited_talk">Invited Talk</option>
              </select>
            </div>
            {Object.entries(pub)
              .filter(([key]) => key !== "type")
              .map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  {key === "year" ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        updatePublication(
                          index,
                          key,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value || ""}
                      onChange={(e) =>
                        updatePublication(index, key, e.target.value)
                      }
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Component for Extracurricular Editor
function ExtracurricularEditor({
  extracurricular,
  onChange,
}: {
  extracurricular: DataType["hobbies_interests_and_extracurricular"];
  onChange: (
    extracurricular: DataType["hobbies_interests_and_extracurricular"]
  ) => void;
}) {
  const updateStudentAthlete = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newExtracurricular = { ...extracurricular };
    newExtracurricular.student_athlete = [...newExtracurricular.student_athlete];
    newExtracurricular.student_athlete[index] = {
      ...newExtracurricular.student_athlete[index],
      [field]: value,
    };
    onChange(newExtracurricular);
  };

  const updateSportsCoach = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newExtracurricular = { ...extracurricular };
    newExtracurricular.sports_coach = [...newExtracurricular.sports_coach];
    newExtracurricular.sports_coach[index] = {
      ...newExtracurricular.sports_coach[index],
      [field]: value,
    };
    onChange(newExtracurricular);
  };

  const updateOthers = (index: number, field: string, value: string) => {
    const newExtracurricular = { ...extracurricular };
    newExtracurricular.others = [...newExtracurricular.others];
    newExtracurricular.others[index] = {
      ...newExtracurricular.others[index],
      [field]: value,
    };
    onChange(newExtracurricular);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Extracurricular Activities</h2>

      {/* Student Athlete */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Student Athlete</h3>
          <Button
            onClick={() => {
              const newExtracurricular = { ...extracurricular };
              newExtracurricular.student_athlete.push({
                achievement: "",
                year: new Date().getFullYear(),
                image: "",
              });
              onChange(newExtracurricular);
            }}
            size="sm"
          >
            Add
          </Button>
        </div>
        {extracurricular.student_athlete.map((item, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Item {index + 1}</h4>
              <Button
                onClick={() => {
                  const newExtracurricular = { ...extracurricular };
                  newExtracurricular.student_athlete = newExtracurricular.student_athlete.filter(
                    (_, i) => i !== index
                  );
                  onChange(newExtracurricular);
                }}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </div>
            {Object.entries(item).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                {key === "year" ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      updateStudentAthlete(index, key, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      updateStudentAthlete(index, key, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Sports Coach */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Sports Coach</h3>
          <Button
            onClick={() => {
              const newExtracurricular = { ...extracurricular };
              newExtracurricular.sports_coach.push({
                role: "",
                year: new Date().getFullYear(),
                image: "",
              });
              onChange(newExtracurricular);
            }}
            size="sm"
          >
            Add
          </Button>
        </div>
        {extracurricular.sports_coach.map((item, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Item {index + 1}</h4>
              <Button
                onClick={() => {
                  const newExtracurricular = { ...extracurricular };
                  newExtracurricular.sports_coach = newExtracurricular.sports_coach.filter(
                    (_, i) => i !== index
                  );
                  onChange(newExtracurricular);
                }}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </div>
            {Object.entries(item).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    updateSportsCoach(
                      index,
                      key,
                      key === "year" ? e.target.value : e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Others */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Other Interests</h3>
          <Button
            onClick={() => {
              const newExtracurricular = { ...extracurricular };
              newExtracurricular.others.push({
                title: "",
                image: "",
              });
              onChange(newExtracurricular);
            }}
            size="sm"
          >
            Add
          </Button>
        </div>
        {extracurricular.others.map((item, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Item {index + 1}</h4>
              <Button
                onClick={() => {
                  const newExtracurricular = { ...extracurricular };
                  newExtracurricular.others = newExtracurricular.others.filter(
                    (_, i) => i !== index
                  );
                  onChange(newExtracurricular);
                }}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </div>
            {Object.entries(item).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateOthers(index, key, e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Component for UI Content Editor (simplified - shows JSON editor)
function UIContentEditor({
  uiContent,
  onChange,
}: {
  uiContent: Record<string, any>;
  onChange: (uiContent: Record<string, any>) => void;
}) {
  const [jsonText, setJsonText] = useState(JSON.stringify(uiContent, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setJsonText(JSON.stringify(uiContent, null, 2));
  }, [uiContent]);

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      setJsonError(null);
      onChange(parsed);
    } catch (err) {
      setJsonError("Invalid JSON");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">UI Content</h2>
      <p className="text-sm text-muted-foreground">
        Edit UI content as JSON. Be careful with the structure.
      </p>
      {jsonError && (
        <div className="p-2 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
          {jsonError}
        </div>
      )}
      <textarea
        value={jsonText}
        onChange={(e) => handleJsonChange(e.target.value)}
        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm min-h-[600px]"
      />
    </div>
  );
}
