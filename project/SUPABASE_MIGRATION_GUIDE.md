# 🗄️ Guia de Migration - Tabela exercise_progress

## ⚠️ IMPORTANTE: Execute Estes Passos no Supabase SQL Editor

O Supabase está com timeout via API. Siga estes passos para criar a tabela manualmente:

---

## 📝 Passo a Passo

### 1. Acesse o Supabase Dashboard
- Entre em: https://supabase.com/dashboard
- Selecione seu projeto
- Clique em **SQL Editor** no menu lateral esquerdo

### 2. Execute Este SQL (Copie e Cole)

```sql
-- ==========================================
-- MIGRATION: Add exercise_progress table
-- ==========================================

-- 1. Criar a tabela principal
CREATE TABLE IF NOT EXISTS public.exercise_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_id 
ON public.exercise_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_exercise_progress_exercise_id 
ON public.exercise_progress(exercise_id);

CREATE INDEX IF NOT EXISTS idx_exercise_progress_completed_at 
ON public.exercise_progress(completed_at);

CREATE INDEX IF NOT EXISTS idx_exercise_progress_day_number 
ON public.exercise_progress(day_number);

-- 3. Constraint único para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_exercise_progress_user_exercise 
ON public.exercise_progress(user_id, exercise_id);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;

-- 5. Policies de RLS
DROP POLICY IF EXISTS "Users can view their own exercise progress" ON public.exercise_progress;
CREATE POLICY "Users can view their own exercise progress"
ON public.exercise_progress FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own exercise progress" ON public.exercise_progress;
CREATE POLICY "Users can insert their own exercise progress"
ON public.exercise_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own exercise progress" ON public.exercise_progress;
CREATE POLICY "Users can delete their own exercise progress"
ON public.exercise_progress FOR DELETE
USING (auth.uid() = user_id);

-- 6. Função para auto-preencher day_number
CREATE OR REPLACE FUNCTION extract_day_number_from_exercise_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.day_number := 
    CASE 
      WHEN NEW.exercise_id ~ '^w1d[1-7]' THEN 
        CAST(substring(NEW.exercise_id from 'w1d([1-7])') AS INTEGER)
      WHEN NEW.exercise_id ~ '^w2d[1-7]' THEN 
        CAST(substring(NEW.exercise_id from 'w2d([1-7])') AS INTEGER) + 7
      WHEN NEW.exercise_id ~ '^w3d[1-7]' THEN 
        CAST(substring(NEW.exercise_id from 'w3d([1-7])') AS INTEGER) + 14
      ELSE 0
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para auto-popular day_number
DROP TRIGGER IF EXISTS set_day_number_trigger ON public.exercise_progress;
CREATE TRIGGER set_day_number_trigger
BEFORE INSERT ON public.exercise_progress
FOR EACH ROW
EXECUTE FUNCTION extract_day_number_from_exercise_id();

-- 8. Comentários de documentação
COMMENT ON TABLE public.exercise_progress IS 'Stores individual exercise completions for granular progress tracking';
COMMENT ON COLUMN public.exercise_progress.exercise_id IS 'Exercise identifier in format: w{week}d{day}e{exercise}, e.g., w1d1e1 for Week 1, Day 1, Exercise 1';
COMMENT ON COLUMN public.exercise_progress.day_number IS 'Day number from 1-21 for easier queries and calculations';
```

### 3. (OPCIONAL) Migrar Dados Existentes

Se você já tem dados na tabela `user_progress` e quer preservá-los:

```sql
-- Migrar dados de user_progress para exercise_progress
INSERT INTO public.exercise_progress (user_id, exercise_id, day_number, completed_at)
SELECT 
  user_id,
  CASE 
    WHEN day_number BETWEEN 1 AND 7 THEN 'w1d' || day_number || 'e1'
    WHEN day_number BETWEEN 8 AND 14 THEN 'w2d' || (day_number - 7) || 'e1'
    WHEN day_number BETWEEN 15 AND 21 THEN 'w3d' || (day_number - 14) || 'e1'
  END as exercise_id,
  day_number,
  completed_at
FROM public.user_progress
ON CONFLICT (user_id, exercise_id) DO NOTHING;
```

### 4. Verificar que Foi Criada

Execute este SQL para verificar:

```sql
-- Verificar se a tabela foi criada
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'exercise_progress'
ORDER BY ordinal_position;

-- Verificar RLS
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'exercise_progress';

-- Verificar se há dados (se você migrou)
SELECT COUNT(*) as total_exercises FROM public.exercise_progress;
```

---

## 🎯 Estrutura da Tabela

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `user_id` | UUID | Referência ao usuário (auth.users) |
| `exercise_id` | TEXT | ID do exercício (ex: 'w1d1e1') |
| `day_number` | INTEGER | Dia de 1-21 (auto-preenchido pelo trigger) |
| `completed_at` | TIMESTAMPTZ | Data/hora de conclusão |
| `created_at` | TIMESTAMPTZ | Data/hora de criação do registro |

---

## 🔐 RLS Policies Criadas

1. **SELECT**: Usuários só veem seu próprio progresso
2. **INSERT**: Usuários só podem inserir seu próprio progresso
3. **DELETE**: Usuários podem deletar seu próprio progresso (função "desfazer")

---

## 📊 Exemplos de exercise_id

| Treino | exercise_id | day_number |
|--------|-------------|------------|
| Semana 1, Dia 1 | `w1d1e1` | 1 |
| Semana 1, Dia 7 | `w1d7e1` | 7 |
| Semana 2, Dia 1 (Dia 8 total) | `w2d1e1` | 8 |
| Semana 2, Dia 7 (Dia 14 total) | `w2d7e1` | 14 |
| Semana 3, Dia 1 (Dia 15 total) | `w3d1e1` | 15 |
| Semana 3, Dia 7 (Dia 21 total) | `w3d7e1` | 21 |

---

## ✅ Após Executar

1. ✅ A tabela `exercise_progress` estará criada
2. ✅ RLS estará ativo e configurado
3. ✅ Trigger irá auto-preencher `day_number`
4. ✅ Sistema de progresso funcionará perfeitamente
5. ✅ Realtime detectará mudanças automaticamente
6. ✅ Semanas desbloquearão corretamente
7. ✅ Botão "Treino do Dia" funcionará
8. ✅ Streak será calculada

---

## 🚨 Troubleshooting

### Se o SQL falhar com erro de permissão:
- Certifique-se de estar usando o usuário `postgres` no SQL Editor
- Ou execute via Dashboard → Database → Tables → New table

### Se o trigger não funcionar:
- Verifique se a função foi criada: `\df extract_day_number_from_exercise_id`
- Verifique se o trigger foi criado: `\d exercise_progress`

### Se o realtime não funcionar:
- No Dashboard → Database → Replication
- Ative a replicação para a tabela `exercise_progress`

---

## 📞 Suporte

Se encontrar problemas, execute:
```sql
SELECT * FROM information_schema.tables WHERE table_name = 'exercise_progress';
```

Se retornar vazio, a tabela não foi criada.

