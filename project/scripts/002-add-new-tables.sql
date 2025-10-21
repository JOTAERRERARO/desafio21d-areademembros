-- Tabela de áudios motivacionais
CREATE TABLE IF NOT EXISTS audios_motivacionais (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo text NOT NULL,
  url text NOT NULL,
  duracao text NOT NULL,
  dia integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela de diário
CREATE TABLE IF NOT EXISTS diario (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  data date DEFAULT now(),
  conteudo text NOT NULL,
  mood text,
  energy integer,
  dia integer,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela de comunidade (posts)
CREATE TABLE IF NOT EXISTS comunidade (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo text NOT NULL,
  data_postagem timestamp with time zone DEFAULT now()
);

-- Tabela de curtidas
CREATE TABLE IF NOT EXISTS curtidas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES comunidade(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE diario ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE curtidas ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para diário
CREATE POLICY "Usuários podem ver apenas suas próprias entradas"
  ON diario FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias entradas"
  ON diario FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias entradas"
  ON diario FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias entradas"
  ON diario FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas de segurança para comunidade
CREATE POLICY "Todos podem ver posts"
  ON comunidade FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem criar posts"
  ON comunidade FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios posts"
  ON comunidade FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas de segurança para curtidas
CREATE POLICY "Todos podem ver curtidas"
  ON curtidas FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem curtir"
  ON curtidas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover suas curtidas"
  ON curtidas FOR DELETE
  USING (auth.uid() = user_id);

-- Inserir áudios motivacionais de exemplo
INSERT INTO audios_motivacionais (titulo, url, duracao, dia) VALUES
  ('O Poder do Começo', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', '3:24', 1),
  ('Disciplina é Liberdade', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', '4:12', 2),
  ('O Corpo que Você Merece', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', '3:58', 3),
  ('Sem Desculpas', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', '4:05', 4),
  ('A Força da Consistência', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', '3:42', 5);
